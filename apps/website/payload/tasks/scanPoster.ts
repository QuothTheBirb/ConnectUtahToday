import type { RequiredDataFromCollectionSlug, TaskConfig } from "payload";

import fs from "fs/promises";
import path from "path";
import { scanPosterWithRunpod } from "@/lib/api/scanPoster";

export const scanPosterTask: TaskConfig<"scanPoster"> = {
	slug: "scanPoster",
	label: "Scan poster and create events",
	inputSchema: [
		{
			name: "imageIds",
			type: "array",
			required: true,
			fields: [
				{
					name: "id",
					type: "text",
					required: true,
				},
			],
		},
		{
			name: "userId",
			type: "text",
			required: true,
		},
	],
	handler: async ({ input, req }) => {
		const { imageIds, userId } = input;
		const { payload } = req;

		const ids = imageIds.map((item) => item.id);
		const buffers: Buffer[] = [];

		// 1. Fetch user to get roles and for creator field
		const user = await payload.findByID({
			collection: "users",
			id: userId,
		});

		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		for (const imageId of ids) {
			// 1. Fetch the image document
			const imageDoc = await payload.findByID({
				collection: "event-assets",
				id: imageId,
			});

			if (!imageDoc || !imageDoc.filename) {
				console.warn(
					`Image with ID ${imageId} not found or missing filename`,
				);
				continue;
			}

			// 2. Resolve the file path
			const filePath = path.join(
				process.cwd(),
				"apps/website/public/event-assets",
				imageDoc.filename,
			);

			// 3. Read the file
			try {
				const buffer = await fs.readFile(filePath);
				buffers.push(buffer);
			} catch (e) {
				console.error(`Failed to read file at ${filePath}:`, e);
			}
		}

		if (buffers.length === 0) {
			throw new Error("No valid images found to scan");
		}

		// 4. Call RunPod
		const scanResult = await scanPosterWithRunpod(buffers);
		if (!Array.isArray(scanResult)) {
			throw new Error("Invalid scan result format");
		}

		const createdEvents = [];

		for (let i = 0; i < scanResult.length; i++) {
			const item = scanResult[i];
			const imageId = ids[i];

			if (item.status !== "success") {
				console.warn(`Scan failed for image ${imageId}:`, item.error);
				continue;
			}

			// Find default organization for the user
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
				});
				if (orgs.docs.length > 0) {
					organizationId = orgs.docs[0].id;
				}
			}

			const eventData: RequiredDataFromCollectionSlug<"events"> = {
				title: item.title || "Untitled Event",
				description: item.description || "",
				url:
					item.links && item.links.length > 0
						? item.links[0]
						: "https://example.com", // url is required
				date: item.date?.start || new Date().toISOString(), // date is required
				endDate: item.date?.end,
				location: {
					country: item.location?.country || "US",
					state: item.location?.state || "UT",
					city: item.location?.city,
					address: item.location?.address,
					postalCode: item.location?.postalCode,
					venue: item.location?.venue,
				},
				source: "local",
				local: {
					images: [imageId],
					organization: organizationId,
					createdBy: user.id,
				},
			};

			const event = await payload.create({
				collection: "events",
				data: eventData,
				// We don't pass user here as we are in a background task
				// and we already handled organization/createdBy
			});

			createdEvents.push(event.id);
		}

		return {
			output: {
				success: true,
				count: createdEvents.length,
				eventIds: createdEvents,
			},
		};
	},
};
