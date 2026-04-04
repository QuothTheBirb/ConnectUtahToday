import type { RequiredDataFromCollectionSlug, TaskConfig } from "payload";

import { fetchMobilizeEvents } from "@/lib/api/fetchMobilizeEvents";
import { SUPPORTED_COUNTRIES } from "@/lib/supportedCountries";
import { US_STATES } from "@/lib/usStates";

import { cleanupStaleEvents, syncEvents, SyncItem } from "./syncEvents";

export const mobilizeSync: TaskConfig<"mobilizeSync"> = {
	slug: "mobilizeSync",
	label: "Sync events from Mobilize",
	handler: async ({ req }) => {
		console.log("Syncing Mobilize events…");

		const settings = await req.payload.findGlobal({
			slug: "event-settings",
		});

		if (!settings.events.mobilize?.enableMobilize) {
			console.log("Mobilize integration disabled, skipping…");

			return {
				output: {
					success: true,
					itemsSynced: 0,
					message: "Mobilize integration disabled, skipping…",
				},
			};
		}

		let totalSynced = 0;
		const syncedMobilizeIds: (string | number)[] = [];

		// Fetch organizations that have Google Calendar sync enabled and should be excluded from Mobilize sync
		const excludedOrgs = await req.payload.find({
			collection: "organizations",
			where: {
				enableGoogleCalendarSync: { equals: true },
				mobilizeSlug: { exists: true },
			},
			limit: 0,
			depth: 0,
		});

		const excludedMobilizeSlugs = excludedOrgs.docs
			.map((org) => org.mobilizeSlug)
			.filter(Boolean) as string[];

		console.log(
			"Excluded Mobilize slugs (Google Calendar sync enabled):",
			excludedMobilizeSlugs,
		);

		// Use 3 months range to total 6 months (+/- 3 months)
		const dateRange = 3;
		const now = new Date();
		const timeMin = new Date(now);
		timeMin.setMonth(now.getMonth() - dateRange);
		const timeMax = new Date(now);
		timeMax.setMonth(now.getMonth() + dateRange);

		// Event filters
		const state = settings.events.mobilize.enableStateFilter
			? settings.events.mobilize.stateFilter?.state
			: undefined;
		const orgFilter =
			settings.events.mobilize.enableOrganizationFilter &&
			settings.events.mobilize.organizationFilter?.type &&
			settings.events.mobilize.organizationFilter?.list
				? {
						type: settings.events.mobilize.organizationFilter.type,
						list: settings.events.mobilize.organizationFilter.list,
					}
				: undefined;

		// Fetch events from Mobilize
		const mobilizeEvents = await fetchMobilizeEvents({
			timeMin: timeMin.toISOString(),
			timeMax: timeMax.toISOString(),
			filters: {
				state: state,
				organizations: orgFilter,
			},
		});

		console.log("Fetched", mobilizeEvents.length, "events from Mobilize");

		const syncItems: SyncItem[] = mobilizeEvents
			.map((event) => {
				if (!event || !event.mobilizeId) return null;

				// Skip events from organizations that have Google Calendar sync enabled
				// by matching the mobilize slug/url
				const mobilizeOrgSlug = event.organization.slug;
				const mobilizeOrgUrl = event.organization.url;

				const isExcluded = excludedMobilizeSlugs.some(
					(excluded) =>
						excluded === mobilizeOrgSlug ||
						excluded === mobilizeOrgUrl,
				);

				if (isExcluded) {
					console.log(
						`Skipping mobilize event ${event.mobilizeId} from excluded organization: ${mobilizeOrgSlug}`,
					);
					return null;
				}

				// Map the API event structure to the Payload event collection structure
				const payloadData: RequiredDataFromCollectionSlug<"events"> = {
					title: event.title,
					description: event.description || "",
					url: event.url,
					date: event.date,
					endDate: event.endDate,
					eventType: event.eventType,
					location: {
						country: event.location?.country
							? SUPPORTED_COUNTRIES.find(
									(country) =>
										event.location?.country ===
										country.value,
								)?.value
							: undefined,
						state: event.location?.state
							? US_STATES.find(
									(state) =>
										event.location?.state === state.value,
								)?.value
							: undefined,
						city: event.location?.city,
						address: event.location?.address,
						postalCode: event.location?.postalCode,
						venue: event.location?.venue,
					},
					source: event.source,
					mobilize: {
						eventId: event.mobilizeId,
						image: event.image,
						organization: {
							orgId: event.organization.id,
							name: event.organization.name,
							slug: event.organization.slug,
							url: event.organization.url,
						},
					},
				};

				return {
					data: payloadData,
					where: {
						source: { equals: "mobilize" },
						"mobilize.eventId": { equals: event.mobilizeId },
					},
					id: event.mobilizeId,
				};
			})
			.filter((item) => item !== null);

		const result = await syncEvents({
			req,
			items: syncItems,
		});

		totalSynced = result.itemsSynced;
		syncedMobilizeIds.push(...result.syncedIds);

		// Remove events that no longer exist or are now filtered out
		try {
			await cleanupStaleEvents({
				req,
				source: "mobilize",
				syncedIds: syncedMobilizeIds,
				idField: "mobilize.eventId",
			});
		} catch (error) {
			return {
				output: {
					success: false,
					itemsSynced: totalSynced,
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
				},
			};
		}

		console.log("Mobilize events synced successfully.");

		return {
			output: {
				success: true,
				itemsSynced: totalSynced,
				message: "Mobilize events synced successfully.",
			},
		};
	},
};
