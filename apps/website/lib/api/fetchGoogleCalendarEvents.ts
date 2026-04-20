import {
	GoogleCalendarApiEventsResponse,
	GoogleCalendarEvent,
} from "@connect-utah-today/api/types";
import { googleCalendarDateToUtcIso } from "@connect-utah-today/utils/toUtcIsoString";
import { Organization } from "@/payload-types";

export interface GetGoogleCalendarEventsOptions {
	apiKey: string;
	calendarId: string;
	organization?: Organization;
	timeMin?: string;
	timeMax?: string;
}

export async function fetchGoogleCalendarEvents(
	options: GetGoogleCalendarEventsOptions,
): Promise<GoogleCalendarEvent[]> {
	const { apiKey, calendarId, organization, timeMin, timeMax } = options;

	const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

	const queryParams = new URLSearchParams({
		key: apiKey,
	});
	if (timeMin) queryParams.append("timeMin", timeMin);
	if (timeMax) queryParams.append("timeMax", timeMax);

	let nextPageToken: string | null | undefined = undefined;
	const allEvents: GoogleCalendarEvent[] = [];

	try {
		do {
			const params = new URLSearchParams(queryParams);
			if (nextPageToken) params.append("pageToken", nextPageToken);

			const url = `${baseUrl}?${params.toString()}`;
			console.log(`Fetching Google Calendar events from: ${url}`);

			const response = await fetch(url);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					`Failed to fetch Google Calendar events: ${errorData.error?.message || response.statusText}`,
				);
			}

			const data: GoogleCalendarApiEventsResponse = await response.json();
			const { items, nextPageToken: token } = data;

			const transformedEvents: GoogleCalendarEvent[] = items
				? items.flatMap((event) => {
						const date = googleCalendarDateToUtcIso(event.start);
						const endDate = googleCalendarDateToUtcIso(event.end);

						if (
							!event.id ||
							!date ||
							!event.summary ||
							!event.htmlLink
						)
							return [];

						if (!organization) {
							return <GoogleCalendarEvent>{
								title: event.summary,
								description: event.description || undefined,
								date: date,
								endDate: endDate,
								url: event.htmlLink,
								location: {
									venue: event.location || undefined,
								},
								googleCalendarId: event.id,
								source: "googleCalendar",
							};
						}

						return <GoogleCalendarEvent>{
							title: event.summary,
							description: event.description || undefined,
							date: date,
							endDate: endDate,
							url: event.htmlLink,
							location: {
								venue: event.location || undefined,
							},
							organization: {
								id: organization.id,
								name: organization.name,
								url: organization.publicContactMethods
									?.contactWebsite,
								slug: organization.slug,
							},
							googleCalendarId: event.id,
							source: "googleCalendar",
						};
					})
				: [];

			allEvents.push(...transformedEvents);

			nextPageToken = token;
		} while (nextPageToken);

		return allEvents;
	} catch (error) {
		console.error("Error fetching Google Calendar events:", error);
		return [];
	}
}
