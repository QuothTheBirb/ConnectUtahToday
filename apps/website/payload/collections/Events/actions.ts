"use server";

import type { RequiredDataFromCollectionSlug } from "payload";
import { getPayload } from "payload";

import fs from "fs/promises";
import path from "path";
import configPromise from "@payload-config";
import { headers } from "next/headers";
import { scanPosterWithRunpod } from "@/lib/api/scanPoster";

export async function uploadPosterEventsAction(formData: FormData) {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		const files = formData.getAll("file") as File[];
		if (files.length === 0) {
			throw new Error("No files provided");
		}

		const imageIds: string[] = [];

		for (const file of files) {
			const buffer = Buffer.from(await file.arrayBuffer());

			const uploadedImage = await payload.create({
				collection: "event-assets",
				data: {
					alt: file.name,
				},
				file: {
					data: buffer,
					name: file.name,
					mimetype: file.type,
					size: file.size,
				},
				user,
			});

			imageIds.push(uploadedImage.id as string);
		}

		// Queue the scanPoster task
		await payload.jobs.queue({
			task: "scanPoster",
			input: {
				imageIds: imageIds.map((id) => ({ id })),
				userId: user.id,
			},
		});

		return { success: true, count: imageIds.length, queued: true };
	} catch (error) {
		console.error("Upload and scan poster action failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function scanPosterAction(imageIds: string | string[]) {
	try {
		const payload = await getPayload({ config: configPromise });
		const ids = Array.isArray(imageIds) ? imageIds : [imageIds];
		const buffers: Buffer[] = [];

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
		const data = await scanPosterWithRunpod(buffers);

		return { success: true, data };
	} catch (error) {
		console.error("Scan poster action failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function scanAndCreateEventsAction(imageIds: string[]) {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		const result = await scanPosterAction(imageIds);
		if (!result.success || !result.data || !Array.isArray(result.data)) {
			return result;
		}

		const createdEvents = [];
		const ids = Array.isArray(imageIds) ? imageIds : [imageIds];

		for (let i = 0; i < result.data.length; i++) {
			const item = result.data[i];
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
				user, // Pass user for access control and hooks
			});

			createdEvents.push(event);
		}

		return { success: true, count: createdEvents.length };
	} catch (error) {
		console.error("Scan and create events action failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
