import type {
	PayloadRequest,
	RequiredDataFromCollectionSlug,
	Where,
} from "payload";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type SyncItem = {
	data: RequiredDataFromCollectionSlug<"events">;
	where: Where;
	id: string | number;
};

/**
 * Shared function to sync events to the "events" collection.
 */
export async function syncEvents({
	req,
	items,
	sleepMs = 50,
}: {
	req: PayloadRequest;
	items: SyncItem[];
	sleepMs?: number;
}) {
	let itemsSynced = 0;
	const syncedIds: (string | number)[] = [];

	for (const item of items) {
		const { data, where, id } = item;
		syncedIds.push(id);

		// Check if event exists
		const existingEventsInDb = await req.payload.find({
			collection: "events",
			where,
			limit: 1,
		});
		const eventDb = existingEventsInDb.docs.length
			? existingEventsInDb.docs[0]
			: undefined;

		try {
			if (eventDb) {
				console.log(`Updating existing event: ${id}`);

				await req.payload.update({
					collection: "events",
					id: eventDb.id,
					data,
				});
			} else {
				console.log(`Creating new event: ${id}`);

				await req.payload.create({
					collection: "events",
					data,
				});
			}

			itemsSynced++;

			if (sleepMs > 0) {
				await sleep(sleepMs);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Failed to sync event ${id}:`, error.message);
			}
		}
	}

	return { itemsSynced, syncedIds };
}

/**
 * Shared function to remove events that no longer exist or are now filtered out.
 */
export async function cleanupStaleEvents({
	req,
	source,
	syncedIds,
	idField,
}: {
	req: PayloadRequest;
	source: "mobilize" | "googleCalendar";
	syncedIds: (string | number)[];
	idField: string;
}) {
	console.log(`Cleaning up stale ${source} events…`);

	const staleEvents = await req.payload.find({
		collection: "events",
		where: {
			and: [
				{ source: { equals: source } },
				{ [idField]: { not_in: syncedIds } },
			],
		},
		limit: 0,
	});

	let deletedCount = 0;

	for (const event of staleEvents.docs) {
		try {
			console.log(`Deleting stale ${source} event: ${event.id}`);

			await req.payload.delete({
				collection: "events",
				id: event.id,
			});

			deletedCount++;
		} catch (error) {
			if (error instanceof Error) {
				console.error(
					`Failed to delete stale event ${event.id}:`,
					error.message,
				);
			}
		}
	}

	console.log(`Deleted ${deletedCount} stale ${source} events.`);

	return { deletedCount };
}
