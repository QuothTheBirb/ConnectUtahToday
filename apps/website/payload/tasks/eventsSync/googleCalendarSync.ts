import type { RequiredDataFromCollectionSlug, TaskConfig } from "payload";

import { fetchGoogleCalendarEvents } from "@/lib/api/fetchGoogleCalendarEvents";
import { Organization } from "@/payload-types";

import { cleanupStaleEvents, syncEvents, SyncItem } from "./syncEvents";

export const googleCalendarSync: TaskConfig<"googleCalendarSync"> = {
	slug: "googleCalendarSync",
	label: "Sync events from Google Calendar",
	handler: async ({ req }) => {
		console.log("Syncing Google Calendar events…");

		const settings = await req.payload.findGlobal({
			slug: "event-settings",
		});

		const apiKey = settings.events.googleCalendar?.googleCalendarApiKey;
		const enableGlobalSync =
			settings.events.googleCalendar?.enableGoogleCalendar;

		if (!apiKey) {
			console.log("Google Calendar API Key missing, skipping…");
			return {
				output: {
					success: true,
					itemsSynced: 0,
					message: "Google Calendar API Key missing.",
				},
			};
		}

		let totalSynced = 0;
		const syncedGoogleCalendarIds: (string | number)[] = [];
		const allSyncItems: SyncItem[] = [];

		const processCalendar = async (
			calendarId: string,
			organization?: Organization,
		) => {
			console.log(`Fetching events for calendar: ${calendarId}`);

			try {
				const events = await fetchGoogleCalendarEvents({
					apiKey,
					calendarId,
					organization,
				});

				console.log(
					`Fetched ${events.length} events from ${calendarId}`,
				);

				for (const event of events) {
					if (event.source !== "googleCalendar") continue;

					const eventId = event.googleCalendarId;
					const payloadData: RequiredDataFromCollectionSlug<"events"> =
						{
							title: event.title,
							description:
								event.description || "No description provided.",
							url: event.url,
							date: event.date,
							endDate: event.endDate,
							source: "googleCalendar" as const,
							location: {
								venue: event.location?.venue,
							},
							googleCalendar: {
								eventId,
								calendarId,
								organization,
							},
						};

					if (!payloadData.date) {
						console.log(
							`Skipping event ${eventId} in calendar ${calendarId} because it has no date.`,
						);
						continue;
					}

					allSyncItems.push({
						data: payloadData,
						where: {
							and: [
								{ source: { equals: "googleCalendar" } },
								{
									"googleCalendar.eventId": {
										equals: eventId,
									},
								},
								{
									"googleCalendar.calendarId": {
										equals: calendarId,
									},
								},
							],
						},
						id: eventId,
					});
				}
			} catch (error) {
				console.error(`Error fetching calendar ${calendarId}:`, error);
			}
		};

		// 1. Process Global Calendars
		if (
			enableGlobalSync &&
			settings.events.googleCalendar?.googleCalendars
		) {
			for (const calendar of settings.events.googleCalendar
				.googleCalendars) {
				if (calendar.calendarId) {
					await processCalendar(calendar.calendarId);
				}
			}
		}

		// 2. Process Organization Calendars
		const enableOrgCalendars =
			settings.events.googleCalendar?.enableOrganizationCalendars;

		if (enableOrgCalendars) {
			const orgsWithSync = await req.payload.find({
				collection: "organizations",
				where: {
					enableGoogleCalendarSync: { equals: true },
				},
				limit: 0,
			});

			for (const org of orgsWithSync.docs) {
				if (org.googleCalendarId) {
					await processCalendar(org.googleCalendarId, org);
				}
			}
		} else {
			console.log(
				"Organization Google Calendar integration disabled, skipping organization calendars…",
			);
		}

		const result = await syncEvents({
			req,
			items: allSyncItems,
		});

		totalSynced = result.itemsSynced;
		syncedGoogleCalendarIds.push(...result.syncedIds);

		// Remove events that no longer exist or are now filtered out
		try {
			await cleanupStaleEvents({
				req,
				source: "googleCalendar",
				syncedIds: syncedGoogleCalendarIds,
				idField: "googleCalendar.eventId",
			});
		} catch (error) {
			console.error(
				"Failed to cleanup stale Google Calendar events:",
				error,
			);
		}

		console.log(
			`Google Calendar sync completed. Total synced: ${totalSynced}`,
		);

		return {
			output: {
				success: true,
				itemsSynced: totalSynced,
				message: `Successfully synced ${totalSynced} events from Google Calendar.`,
			},
		};
	},
};
