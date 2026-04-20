import {
	MobilizeApiEventsResponse,
	MobilizeCalendarEvent,
} from "@connect-utah-today/api/types";
import { mobilizeTimestampToUtcIso } from "@connect-utah-today/utils/toUtcIsoString";

export interface GetMobilizeEventsOptions {
	timeMin: string;
	timeMax: string;
	filters?: {
		state?: string;
		organizations?: {
			type: "allowlist" | "blocklist";
			list: string[];
		};
	};
}

export async function fetchMobilizeEvents(
	options: GetMobilizeEventsOptions,
): Promise<MobilizeCalendarEvent[]> {
	const { timeMin, timeMax, filters } = options;

	// Convert ISO8601 to UNIX timestamp (seconds)
	const start = timeMin
		? Math.floor(new Date(timeMin).getTime() / 1000)
		: undefined;
	const end = timeMax
		? Math.floor(new Date(timeMax).getTime() / 1000)
		: undefined;

	// Use production or staging API based on the environment
	// const mobilizeApiBase =
	// 	process.env.NODE_ENV === "production"
	// 		? "https://api.mobilize.us"
	// 		: "https://staging-api.mobilize.us";
	const mobilizeApiBase = "https://api.mobilize.us"; // Currently using main api for both production and development so there are enough events to properly test with.

	const baseUrl = `${mobilizeApiBase}/v1/organizations/1/events?`;

	const queryParams = new URLSearchParams({
		per_page: "200",
	});
	if (start) queryParams.append("timeslot_start", `gte_${start}`);
	if (end) queryParams.append("timeslot_start", `lt_${end}`);

	if (filters?.state) {
		queryParams.append("state", filters.state);
	}

	let nextUrl: string | null = `${baseUrl}${queryParams.toString()}`;
	const allEvents: MobilizeCalendarEvent[] = [];

	try {
		while (nextUrl) {
			console.log(`Fetching Mobilize events from: ${nextUrl}`);

			const response = await fetch(nextUrl);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch Mobilize events: ${response.statusText}`,
				);
			}

			const data: MobilizeApiEventsResponse = await response.json();
			const { data: events, next } = data;

			const transformedEvents: MobilizeCalendarEvent[] = events
				? events.flatMap((event) => {
						const timeslot = event.timeslots && event.timeslots[0];
						const date = mobilizeTimestampToUtcIso(
							timeslot?.start_date,
						);
						const endDate = mobilizeTimestampToUtcIso(
							timeslot?.end_date,
						);
						const organization = event.sponsor;

						if (!date || !organization) return [];

						if (filters?.organizations) {
							const { type, list } = filters.organizations;

							if (
								type === "allowlist" &&
								!list.includes(organization.slug)
							) {
								return [];
							}

							if (
								type === "blocklist" &&
								list.includes(organization.slug)
							) {
								return [];
							}
						}

						const calendarEvent: MobilizeCalendarEvent = {
							title: event.title,
							description: event.description,
							date: date,
							endDate: endDate,
							url: event.browser_url,
							image: event.featured_image_url,
							location: {
								country: event.location?.country,
								state: event.location?.region,
								city: event.location?.locality,
								address: event.location?.address_lines
									?.filter(Boolean)
									.join(", "),
								postalCode: event.location?.postal_code,
								venue: event.location?.venue,
							},
							organization: {
								id: organization.id,
								name: organization.name,
								url: organization.event_feed_url,
								slug: organization.slug,
							},
							mobilizeId: event.id,
							eventType: event.event_type,
							source: "mobilize",
						};

						return calendarEvent;
					})
				: [];

			allEvents.push(...transformedEvents);

			nextUrl = next;

			if (nextUrl) {
				// Delay to avoid hitting rate limits (5 requests per second = 200ms delay)
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}

		return allEvents;
	} catch (error) {
		console.error("Failed to fetch Mobilize events:", error);
		throw error;
	}
}

export async function getMobilizeOrganizations(): Promise<
	{ id: string; name: string; slug: string; url: string }[]
> {
	// Extract unique organizations from Mobilize events within a +/- 6 month range
	const now = new Date();
	const timeMin = new Date(now);
	timeMin.setMonth(now.getMonth() - 6);
	const timeMax = new Date(now);
	timeMax.setMonth(now.getMonth() + 6);

	try {
		const events = await fetchMobilizeEvents({
			timeMin: timeMin.toISOString(),
			timeMax: timeMax.toISOString(),
		});

		const organizationsMap = new Map();
		events.forEach((event) => {
			if (event.source === "mobilize" && event.organization) {
				organizationsMap.set(event.mobilizeId, event.organization);
			}
		});

		return Array.from(organizationsMap.values()).map((org) => ({
			id: String(org.id),
			name: org.name,
			slug: org.slug,
			url: org.url,
		}));
	} catch (error) {
		console.error("Failed to fetch Mobilize organizations:", error);
		return [];
	}
}
