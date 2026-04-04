import { WorkflowConfig } from "payload";

export const manualSyncEvents: WorkflowConfig<"manualSyncEvents"> = {
	slug: "manualSyncEvents",
	label: "Manual event sync initiated by a user.",
	inputSchema: [
		{
			name: "userId",
			type: "text",
			required: true,
		},
	],
	handler: async ({ job, tasks, req }) => {
		// Cancel any actively processing scheduled sync-events jobs
		await req.payload.update({
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
				error: {
					message: "Canceled by a manual sync request.",
				},
			},
			overrideAccess: true,
		});

		await tasks.mobilizeSync("manual-sync-mobilize-events", {});
		await tasks.googleCalendarSync(
			"manual-sync-google-calendar-events",
			{},
		);

		req.payload.logger.info(
			`Manual sync completed for user: ${(job.input as { userId: string }).userId}`,
		);
	},
};
