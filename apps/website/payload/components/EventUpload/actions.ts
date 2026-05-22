"use server";

import configPromise from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";

async function uploadImages(formData: FormData, payload: any, user: any) {
	const files = formData.getAll("file") as File[];
	if (files.length === 0) {
		throw new Error("No files provided");
	}

	const uploadedImages = [];
	for (const file of files) {
		const buffer = Buffer.from(await file.arrayBuffer());
		const uploadedImage = await payload.create({
			collection: "event-assets",
			data: { alt: file.name },
			file: {
				data: buffer,
				name: file.name,
				mimetype: file.type,
				size: file.size,
			},
			user,
		});
		uploadedImages.push({
			id: uploadedImage.id,
			url: uploadedImage.url,
			filename: uploadedImage.filename || file.name,
			buffer,
		});
	}
	return uploadedImages;
}

export async function uploadPosterEventsAction(formData: FormData) {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		const uploadedImages = await uploadImages(formData, payload, user);

		for (const img of uploadedImages) {
			await payload.jobs.queue({
				task: "scanPoster",
				queue: "posters",
				input: {
					imageId: img.id,
					userId: user.id,
				},
			});
		}

		return { success: true, count: uploadedImages.length, queued: true };
	} catch (error) {
		console.error("Upload and scan poster action failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
