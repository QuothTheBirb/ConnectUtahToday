import { getPayload } from "payload";
import {
	CalendarEvents,
	GoogleCalendarEvent,
	LocalCalendarEvent,
	MobilizeCalendarEvent,
	MobilizeEventType,
} from "@connect-utah-today/api/types";
import config from "@/payload.config";

export const getEventsForMonth = async ({
	year,
	month,
}: {
	year: number;
	month: number;
}): Promise<CalendarEvents> => {
	const payload = await getPayload({ config });

	const eventsConfig = await payload.findGlobal({
		slug: "event-settings",
	});

	const start = new Date(year, month, 1).toISOString();
	const end = new Date(year, month + 1, 1).toISOString();

	const allEvents: CalendarEvents = [];

	// Fetch local events
	if (eventsConfig?.events.localEvents?.enableLocalEvents) {
		const localEvents = await payload.find({
			collection: "events",
			where: {
				and: [
					{
						source: { equals: "local" },
					},
					{
						date: { greater_than_equal: start },
					},
					{
						date: { less_than: end },
					},
				],
			},
			depth: 2,
			limit: 0,
		});

		const calendarEvents: LocalCalendarEvent[] = localEvents.docs.flatMap(
			(event) => {
				const organization = event.local?.organization;

				if (
					event.source !== "local" ||
					!event.local ||
					!organization ||
					typeof organization !== "object"
				)
					return [];

				const images = event.local.images;
				const firstImage =
					Array.isArray(images) && images.length > 0
						? images[0]
						: undefined;
				const image = firstImage
					? typeof firstImage === "object"
						? firstImage.url
						: firstImage
					: undefined;
				const defaultImageAsset =
					organization &&
					typeof organization === "object" &&
					"defaultEventImage" in organization
						? (
								organization as {
									defaultEventImage?:
										| { url?: string }
										| string;
								}
							).defaultEventImage
						: undefined;
				const defaultImage =
					typeof defaultImageAsset === "object" &&
					defaultImageAsset?.url
						? defaultImageAsset.url
						: undefined;

				return {
					id: event.id,
					title: event.title,
					description: event.description,
					date: event.date,
					endDate: event.endDate || undefined,
					url: event.url,
					source: "local",
					image: image || defaultImage || undefined,
					location: event.location
						? {
								country: event.location.country || undefined,
								state: event.location.state || undefined,
								city: event.location.city || undefined,
								address: event.location.address || undefined,
								postalCode:
									event.location.postalCode || undefined,
								venue: event.location.venue || undefined,
							}
						: undefined,
					organization: {
						id: organization.id,
						name: organization.name,
						slug: organization.slug,
						url:
							organization.publicContactMethods?.contactWebsite ||
							undefined,
					},
				};
			},
		);

		allEvents.push(...calendarEvents);
	}

	// Fetch Mobilize events
	if (eventsConfig?.events.mobilize?.enableMobilize) {
		const mobilizeEvents = await payload.find({
			collection: "events",
			where: {
				and: [
					{
						source: { equals: "mobilize" },
					},
					{
						date: { greater_than_equal: start },
					},
					{
						date: { less_than: end },
					},
				],
			},
			depth: 2,
			limit: 0,
		});

		const calendarEvents: MobilizeCalendarEvent[] =
			mobilizeEvents.docs.flatMap((event) => {
				if (event.source !== "mobilize" || !event.mobilize) return [];

				const organization = event.mobilize.organization;

				return {
					id: event.id,
					title: event.title,
					description: event.description,
					date: event.date,
					endDate: event.endDate || undefined,
					url: event.url,
					source: "mobilize",
					image: event.mobilize.image || undefined,
					location: event.location
						? {
								country: event.location.country || undefined,
								state: event.location.state || undefined,
								city: event.location.city || undefined,
								address: event.location.address || undefined,
								postalCode:
									event.location.postalCode || undefined,
								venue: event.location.venue || undefined,
							}
						: undefined,
					organization: {
						id: organization.orgId,
						name: organization.name,
						slug: organization.slug,
						url: organization.url,
					},
					mobilizeId: event.mobilize.eventId,
					eventType: event.eventType as MobilizeEventType | undefined,
				};
			});

		allEvents.push(...calendarEvents);
	}

	// Fetch Google Calendar events
	// Google Calendar events are fetched when either the global integration or
	// organization calendar sync is enabled, since each has its own sync path
	// and either can independently populate events into the collection.
	if (
		eventsConfig?.events.googleCalendar?.enableGoogleCalendar ||
		eventsConfig?.events.googleCalendar?.enableOrganizationCalendars
	) {
		const googleEvents = await payload.find({
			collection: "events",
			where: {
				and: [
					{
						source: { equals: "googleCalendar" },
					},
					{
						date: { greater_than_equal: start },
					},
					{
						date: { less_than: end },
					},
				],
			},
			depth: 2,
			limit: 0,
		});

		const calendarEvents: GoogleCalendarEvent[] = googleEvents.docs.flatMap(
			(event) => {
				if (event.source !== "googleCalendar" || !event.googleCalendar)
					return [];

				const organization =
					typeof event.googleCalendar.organization === "object"
						? event.googleCalendar.organization
						: undefined;
				const organizationDefaultImage =
					organization && "defaultEventImage" in organization
						? organization.defaultEventImage
						: undefined;
				const defaultImage =
					organizationDefaultImage &&
					typeof organizationDefaultImage === "object" &&
					organizationDefaultImage?.url
						? organizationDefaultImage.url
						: undefined;

				return {
					id: event.id,
					title: event.title,
					description: event.description,
					date: event.date,
					endDate: event.endDate || undefined,
					url: event.url,
					source: "googleCalendar",
					image: defaultImage || undefined,
					location: event.location
						? {
								country: event.location.country || undefined,
								state: event.location.state || undefined,
								city: event.location.city || undefined,
								address: event.location.address || undefined,
								postalCode:
									event.location.postalCode || undefined,
								venue: event.location.venue || undefined,
							}
						: undefined,
					organization: organization
						? {
								id: organization.id,
								name: organization.name,
								slug: organization.slug,
								url:
									organization.publicContactMethods
										?.contactWebsite || undefined,
							}
						: undefined,
					googleCalendarId: event.googleCalendar.eventId,
				};
			},
		);

		allEvents.push(...calendarEvents);
	}

	// Sort events by date
	allEvents.sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	return allEvents;
};
