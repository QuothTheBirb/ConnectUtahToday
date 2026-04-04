import config from "@payload-config";
import { headers } from "next/headers";
import { after, NextResponse } from "next/server";
import { getPayload } from "payload";

export const maxDuration = 300;

const MANUAL_SYNC_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export const GET = async () => {
	try {
		const payload = await getPayload({ config });

		const { docs } = await payload.find({
			collection: "payload-jobs",
			where: {
				and: [
					{ queue: { equals: "manual-sync-events" } },
					{ processing: { equals: true } },
				],
			},
			limit: 1,
			overrideAccess: true,
		});

		if (docs.length > 0) {
			const job = docs[0] as (typeof docs)[0] & { createdAt: string };
			return NextResponse.json({
				status: "processing",
				startedAt: job.createdAt,
			});
		}

		return NextResponse.json({ status: "idle" });
	} catch (error) {
		console.error("Error checking sync status:", error);
		return NextResponse.json(
			{ error: "Failed to check sync status." },
			{ status: 500 },
		);
	}
};

export const POST = async () => {
	try {
		const payload = await getPayload({ config });
		const headersList = await headers();
		const { user } = await payload.auth({ headers: headersList });

		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized." },
				{ status: 401 },
			);
		}

		// Check if a manual sync is already in progress
		const { docs: activeJobs } = await payload.find({
			collection: "payload-jobs",
			where: {
				and: [
					{ queue: { equals: "manual-sync-events" } },
					{ processing: { equals: true } },
				],
			},
			limit: 1,
			overrideAccess: true,
		});

		if (activeJobs.length > 0) {
			const activeJob = activeJobs[0] as (typeof activeJobs)[0] & {
				createdAt: string;
			};
			const elapsed =
				Date.now() - new Date(activeJob.createdAt).getTime();

			if (elapsed < MANUAL_SYNC_TIMEOUT_MS) {
				return NextResponse.json(
					{ error: "A manual sync is already in progress." },
					{ status: 409 },
				);
			}

			// Beyond 5 minutes — cancel the stale sync and allow a new one
			await payload.update({
				collection: "payload-jobs",
				where: {
					and: [
						{ queue: { equals: "manual-sync-events" } },
						{ processing: { equals: true } },
					],
				},
				data: {
					processing: false,
					hasError: true,
					error: {
						message:
							"Canceled by a new manual sync request after timeout.",
					},
				},
				overrideAccess: true,
			});
		}

		// Cancel any queued (not yet started) sync-events and manual-sync-events jobs
		await payload.update({
			collection: "payload-jobs",
			where: {
				and: [
					{ queue: { in: ["sync-events", "manual-sync-events"] } },
					{ processing: { equals: false } },
					{ hasError: { not_equals: true } },
					{ completedAt: { exists: false } },
				],
			},
			data: {
				hasError: true,
				error: { message: "Canceled by a manual sync request." },
			},
			overrideAccess: true,
		});

		// Cancel any actively processing scheduled sync-events jobs
		await payload.update({
			collection: "payload-jobs",
			where: {
				and: [
					{ queue: { equals: "sync-events" } },
					{ processing: { equals: true } },
				],
			},
			data: {
				processing: false,
				hasError: true,
				error: { message: "Canceled by a manual sync request." },
			},
			overrideAccess: true,
		});

		// Queue the manual sync with the requesting user's ID
		await payload.jobs.queue({
			workflow: "manualSyncEvents",
			input: { userId: String(user.id) },
			queue: "manual-sync-events",
		});

		// Run the queue after the response is sent so the route returns immediately
		after(async () => {
			await payload.jobs.run({ queue: "manual-sync-events" });
		});

		return NextResponse.json(
			{ message: "Sync successfully started." },
			{ status: 202 },
		);
	} catch (error) {
		console.error("Error starting manual sync:", error);
		return NextResponse.json(
			{ error: "Failed to start sync." },
			{ status: 500 },
		);
	}
};
