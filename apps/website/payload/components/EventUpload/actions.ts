"use server";

import configPromise from "@payload-config";
import { headers } from "next/headers";
import { getPayload, Payload } from "payload";
import { User } from "@/payload-types";

async function uploadImages(formData: FormData, payload: Payload, user: User) {
	const files = formData.getAll("file");

	if (files.length === 0) {
		throw new Error("No files provided");
	}

	const uploadedImages = [];
	for (const file of files) {
		if (typeof file === "string") continue;

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

export const uploadPosterEventsAction = async (formData: FormData) => {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		const uploadedImages = await uploadImages(formData, payload, user);
		const eventImageIndex = parseInt(
			formData.get("eventImageIndex") as string,
			10,
		);
		const eventImageId = Number.isFinite(eventImageIndex)
			? (uploadedImages[eventImageIndex]?.id ?? null)
			: null;

		await payload.jobs.queue({
			task: "scanPoster",
			queue: "posters",
			input: {
				imageIds: uploadedImages.map((img) => ({ imageId: img.id })),
				...(eventImageId ? { eventImageId } : {}),
				userId: user.id,
			},
		});

		return { success: true, count: 1, queued: true };
	} catch (error) {
		console.error("Upload and scan poster action failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

// Fetch a scanPoster job and verify it belongs to the current user
const getOwnedScanPosterJob = async (
	payload: Payload,
	user: User,
	jobId: string,
) => {
	const job = await payload.findByID({
		collection: "payload-jobs",
		id: jobId,
		overrideAccess: true,
	});

	if (
		!job ||
		job.taskSlug !== "scanPoster" ||
		(job.input as any)?.userId !== user.id
	) {
		throw new Error("Job not found");
	}

	return job;
};

export const dismissPosterUploadJob = async (jobId: string) => {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		await getOwnedScanPosterJob(payload, user, jobId);
		await payload.delete({
			collection: "payload-jobs",
			id: jobId,
			overrideAccess: true,
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to dismiss poster upload job:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

export const retryPosterUploadJob = async (jobId: string) => {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		const job = await getOwnedScanPosterJob(payload, user, jobId);
		const { imageIds, eventImageId, userId } = (job.input ?? {}) as {
			imageIds: { imageId: string }[];
			eventImageId?: string;
			userId: string;
		};

		// Re-queue a fresh job with the same input, then remove the failed one
		await payload.jobs.queue({
			task: "scanPoster",
			queue: "posters",
			input: {
				imageIds,
				...(eventImageId ? { eventImageId } : {}),
				userId,
			},
		});
		await payload.delete({
			collection: "payload-jobs",
			id: jobId,
			overrideAccess: true,
		});

		return { success: true };
	} catch (error) {
		console.error("Failed to retry poster upload job:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

export type UserEventUpload = {
	id: string;
	status: "pending" | "processing" | "success" | "failed";
	imageId: string;
	imageUrl: string | null;
	createdAt: string;
	completedAt: string | null;
	error: string | null;
	eventIds: string[];
};
export const getUserEventUploads = async (): Promise<
	UserEventUpload[] | null
> => {
	try {
		const payload = await getPayload({ config: configPromise });
		const { user } = await payload.auth({ headers: await headers() });

		if (!user) {
			throw new Error("You must be logged in to perform this action");
		}

		// 1. Fetch current jobs
		const { docs: jobDocs } = await payload.find({
			collection: "payload-jobs",
			where: {
				and: [
					{
						taskSlug: {
							equals: "scanPoster",
						},
					},
					{
						"input.userId": {
							equals: user.id,
						},
					},
				],
			},
			sort: "-createdAt",
			limit: 100,
			overrideAccess: true,
		});

		// 2. Fetch successfully created events via poster upload
		const { docs: eventDocs } = await payload.find({
			collection: "events",
			where: {
				and: [
					{
						"local.isPosterUpload": {
							equals: true,
						},
					},
					{
						"local.createdBy": {
							equals: user.id,
						},
					},
				],
			},
			sort: "-createdAt",
			limit: 100,
			overrideAccess: true,
		});

		const jobs = await Promise.all(
			jobDocs.map(async (job) => {
				const status: "pending" | "processing" | "success" | "failed" =
					job.hasError
						? "failed"
						: job.completedAt
							? "success"
							: job.processing
								? "processing"
								: "pending";

				const eventImageId = (job.input as any)?.eventImageId;
				const imageIds: { imageId: string }[] =
					(job.input as any)?.imageIds ?? [];
				const displayImageId =
					eventImageId ?? imageIds[0]?.imageId ?? null;
				let imageUrl = null;

				if (displayImageId) {
					try {
						const image = await payload.findByID({
							collection: "event-assets",
							id: displayImageId,
							depth: 0,
							overrideAccess: true,
						});
						imageUrl = image?.url ?? null;
					} catch (e) {
						// Image might have been deleted
					}
				}

				return {
					id: job.id,
					status,
					imageId: eventImageId,
					imageUrl,
					createdAt: job.createdAt,
					completedAt: job.completedAt ?? null,
					error: typeof job.error === "string" ? job.error : null,
					// TODO: Fix all of this to be properly typed
					eventIds:
						(job.taskStatus as any)?.scanPoster?.[
							Object.keys(
								(job.taskStatus as any)?.scanPoster ?? {},
							)[0] ?? ""
						]?.output?.eventIds ?? null,
				};
			}),
		);

		// Combine with events that don't have a corresponding job (since jobs are deleted on success)
		const processedImageIds = new Set(
			jobDocs.flatMap((job) =>
				((job.input as any)?.imageIds ?? []).map(
					(entry: { imageId: string }) => entry.imageId,
				),
			),
		);

		const eventJobs = await Promise.all(
			eventDocs
				.filter((event) => {
					const posterImageId =
						typeof event.local?.posterImage === "object"
							? event.local?.posterImage?.id
							: event.local?.posterImage;
					return (
						posterImageId && !processedImageIds.has(posterImageId)
					);
				})
				.map(async (event) => {
					const imageId =
						typeof event.local?.posterImage === "object"
							? event.local?.posterImage?.id
							: event.local?.posterImage;

					let imageUrl = null;
					if (imageId) {
						try {
							const image = await payload.findByID({
								collection: "event-assets",
								id: imageId,
								depth: 0,
								overrideAccess: true,
							});
							imageUrl = image?.url ?? null;
						} catch (e) {
							// Image might have been deleted
						}
					}

					return {
						id: `event-${event.id}`,
						status: "success" as const,
						imageId,
						imageUrl,
						createdAt: event.createdAt,
						completedAt: event.createdAt,
						error: null,
						eventIds: [event.id],
					};
				}),
		);

		return [...jobs, ...eventJobs].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);
	} catch (error) {
		console.error("Failed to get user event upload jobs:", error);
		return null;
	}
};
