import type { RequiredDataFromCollectionSlug, TaskConfig } from "payload";

import fs from "fs/promises";
import path from "path";
import { DateTime } from "luxon";
import { scanPosterWithRunpod } from "@/lib/api/scanPoster";
import { SUPPORTED_COUNTRIES } from "@/lib/supportedCountries";
import { US_STATES } from "@/lib/usStates";

const parseDateTimeStrings = (dateString?: string, timeString?: string) => {
	if (!dateString) return undefined;

	// TODO: Use value set in site settings for a timezone
	const timezone = "America/Denver";

	// Check if date string includes a year, if not, assume current year
	const date = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
		? DateTime.fromFormat(dateString, "yyyy-MM-dd", {
				zone: timezone,
			})
		: DateTime.fromFormat(dateString, "MM-dd", {
				zone: timezone,
			});
	const time = timeString ? DateTime.fromFormat(timeString, "t", { zone: timezone }) : undefined;

	if (!date) return undefined;
	if (!time) return date.toISO() || undefined;

	return (
		date
			.set({
				hour: time.hour ?? 0,
				minute: time.minute ?? 0,
			})
			.toISO() || undefined
	);
};

export const scanPosterTask: TaskConfig<"scanPoster"> = {
	slug: "scanPoster",
	label: "Scan poster and upload events",
	inputSchema: [
		{
			name: "imageIds",
			type: "array",
			required: true,
			fields: [
				{
					name: "imageId",
					type: "text",
					required: true,
				},
			],
		},
		{
			name: "eventImageId",
			type: "text",
		},
		{
			name: "userId",
			type: "text",
			required: true,
		},
	],
	handler: async ({ input, req }) => {
		const { imageIds, eventImageId = null, userId } = input;
		const { payload } = req;

		// 1. Fetch user to get roles and for the creator field
		const user = await payload.findByID({
			collection: "users",
			id: userId,
			overrideAccess: true,
		});

		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		// 2. Use the collection config to get the correct absolute path to images
		const eventAssetsConfig = payload.collections["event-assets"].config;
		const staticDir = eventAssetsConfig.upload.staticDir;
		if (!staticDir) {
			throw new Error(
				`Static directory for 'event-assets' collection is not set`,
			);
		}

		// 3. Fetch all image documents and read their buffers
		const ids = imageIds.map((entry: { imageId: string }) => entry.imageId);
		const buffers: Buffer[] = await Promise.all(
			ids.map(async (imageId: string) => {
				const imageDoc = await payload.findByID({
					collection: "event-assets",
					id: imageId,
					overrideAccess: true,
				});
				if (!imageDoc || !imageDoc.filename) {
					throw new Error(
						`Image with ID ${imageId} not found or missing filename`,
					);
				}
				const filePath = path.join(staticDir, imageDoc.filename);
				const buffer = await fs.readFile(filePath);
				if (!buffer) {
					throw new Error(`Failed to read file at ${filePath}`);
				}
				return buffer;
			}),
		);

		// 4. Call RunPod with all images
		const scanResult = await scanPosterWithRunpod(buffers);
		payload.logger.info({ imageIds: ids, scanResult }, "Poster scan completed");

		if (!scanResult) {
			throw new Error(
				`Scan failed: RunPod returned no output for images ${ids.join(", ")}`,
			);
		}
		if (scanResult.status !== "success") {
			throw new Error(
				`Scan failed (status="${scanResult.status}"): ${scanResult.error || scanResult.adminNotes || "No error or adminNotes provided by the model."}`,
			);
		}

		// 6. Create the event
		// Find the default organization for the user
		let organizationId = null;
		if (user.roles?.includes("organizer")) {
			const orgs = await payload.find({
				collection: "organizations",
				where: {
					organizers: {
						contains: user.id,
					},
				},
				limit: 1,
				overrideAccess: true,
			});

			if (orgs.docs.length > 0) {
				organizationId = orgs.docs[0].id;
			}
		}

		const start = parseDateTimeStrings(
			scanResult.date?.start,
			scanResult.time?.start,
		);
		const end = parseDateTimeStrings(
			scanResult.date?.end ?? scanResult.date?.start,
			scanResult.time?.end,
		);

		if (!scanResult.title || !scanResult.description || !start) {
			throw new Error("Scan result missing required date information");
		}

		const eventData: RequiredDataFromCollectionSlug<"events"> = {
			title: scanResult.title,
			description: scanResult.description,
			// TODO: Switch url to links field which is an array
			// url:
			// 	scanResult.links && scanResult.links.length > 0
			// 		? scanResult.links[0]
			date: start,
			endDate: end,
			location: {
				// TODO: Use default country/state values set in global site configuration
				country: scanResult.location?.country
					? SUPPORTED_COUNTRIES.find(
							(country) =>
								scanResult.location?.country === country.value,
						)?.value
					: undefined,
				state: scanResult.location?.state
					? US_STATES.find(
							(state) =>
								scanResult.location?.state === state.value,
						)?.value
					: undefined,
				city: scanResult.location?.city,
				address: scanResult.location?.street,
				postalCode: scanResult.location?.postalCode,
				venue: scanResult.location?.venue,
			},
			source: "local",
			local: {
				images: eventImageId ? [eventImageId] : undefined,
				organization: organizationId,
				createdBy: user.id,
				isPosterUpload: true,
				posterImage: eventImageId || ids[0],
			},
		};

		const event = await payload.create({
			collection: "events",
			data: eventData,
			overrideAccess: true,
		});

		return {
			output: {
				success: true,
				count: 1,
				eventIds: [event.id],
			},
		};
	},
};
