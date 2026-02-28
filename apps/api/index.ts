import axios, {AxiosResponse} from 'axios';
import cors from 'cors';
import 'dotenv/config';
import type {Request, Response} from 'express';
import express from 'express';
import {Pool} from 'pg';

import {
	EventsApiQueryParams,
	EventsApiResponse,
	GoogleCalendarApiEventsResponse,
	MobilizeApiEventsResponse,
	MobilizeCalendarEvent,
	MobilizeEventsApiResponse
} from "./types";
import {googleCalendarDateToUtcIso, mobilizeTimestampToUtcIso} from "@connect-utah-today/utils/toUtcIsoString";

const app = express();

app.use(cors());
app.use(express.json());

const apiBase = process.env.NODE_ENV === 'production'
	? 'https://connectutahtoday-1.onrender.com/api'
	: `http://localhost:${process.env.PORT || 3001}`;

// API route paths start with "/*" instead of "/api/*" as the base route, since it's separate from the website server now. This is to keep the server flexible in what routes it can be served at. The Next.js webserver routes "/api/*" requests to "/*" on this server.

// Health check endpoint
app.get('/', (req, res) => {
	try {
		res.send('ConnectUtahToday API is running.');
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error:', error.message);

			throw new Error(`Internal Server Error: ${error.message}`);
		}
	}
});

// Database setup
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
});

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

/**
 * Google Calendar API Proxy (production)
 */
async function fetchGoogleCalendarEvents(reqQuery: EventsApiQueryParams): Promise<EventsApiResponse> {
	const {timeMin, timeMax, googleCalendar} = reqQuery;
	const apiKey = googleCalendar?.apiKey;
	const calendarId = googleCalendar?.calendarId;

	if (!apiKey) {
		console.log('Google Calendar API key not set. Skipping Google Calendar events fetch.');
		return {data: []};
	}

	if (!calendarId) {
		console.log('Google Calendar ID not set. Skipping Google Calendar events fetch.');
		return {data: []};
	}

	let url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}`;
	if (timeMin) url += `&timeMin=${encodeURIComponent(timeMin)}`;
	if (timeMax) url += `&timeMax=${encodeURIComponent(timeMax)}`;
	url += '&singleEvents=true&orderBy=startTime';

	try {
		const response: AxiosResponse<GoogleCalendarApiEventsResponse> = await axios.get(url);

		const events = response.data.items ? response.data.items.flatMap((event) => {
			const date = googleCalendarDateToUtcIso(event.start);
			const endDate = googleCalendarDateToUtcIso(event.end);
			const organization = event.organizer;

			if (!event.id || !date || !event.summary || !event.htmlLink || !organization) return [];

			return {
				title: event.summary,
				description: event.description || undefined,
				date: date,
				endDate: endDate,
				organization: {
					id: organization.id,
					name: organization.displayName,
				},
				url: event.htmlLink,
				eventType: 'CUTCOMMUNITY' as const,
				source: 'google' as const,
				googleCalendarId: event.id
			}
		}) : []

		return {data: events};
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching Google Calendar events:', error.message);
		}

		return {data: []};
	}
}

// TODO: List all public events is deprecated: https://github.com/mobilizeamerica/api?tab=readme-ov-file#deprecated-list-all-public-events

// New query style: https://github.com/mobilizeamerica/api?tab=readme-ov-file#list-organization-events

async function fetchMobilizeEvents(reqQuery: EventsApiQueryParams): Promise<MobilizeEventsApiResponse> {
	const {timeMin, timeMax, mobilize} = reqQuery;
	const filters = mobilize?.filters;

	if (!timeMin || !timeMax) throw new Error(
		'Missing required query parameters: timeMin and timeMax'
	);

	// Convert ISO8601 to UNIX timestamp (seconds)
	const start = timeMin ? Math.floor(new Date(timeMin).getTime() / 1000) : undefined;
	const end = timeMax ? Math.floor(new Date(timeMax).getTime() / 1000) : undefined;

	// Use production or staging API based on the environment
	const mobilizeApiBase = process.env.NODE_ENV !== 'production'
		? 'https://api.mobilize.us'
		: 'https://staging-api.mobilize.us';

	const baseUrl = `${mobilizeApiBase}/v1/organizations/1/events?`;

	const queryParams = new URLSearchParams({
		per_page: '200',
	});

	if (start) queryParams.append('timeslot_start', `gte_${start}`);
	if (end) queryParams.append('timeslot_start', `lt_${end}`);

	const activeFilters = {
		...filters,
		state: reqQuery.state || filters?.state,
	};

	if (!activeFilters.organizations && (reqQuery as any).organizations) {
		try {
			activeFilters.organizations = typeof (reqQuery as any).organizations === 'string'
				? JSON.parse((reqQuery as any).organizations)
				: (reqQuery as any).organizations;
		} catch (e) {
			console.error('Failed to parse organizations filter:', e);
		}
	}

	if (activeFilters.state) {
		queryParams.append('state', activeFilters.state);
	}

	let nextUrl: string | null = `${baseUrl}${queryParams.toString()}`;
	const allEvents = [];

	try {
		while (nextUrl) {
			console.log(nextUrl)

			const response: AxiosResponse<MobilizeApiEventsResponse> = await axios.get(nextUrl);
			const {data, next} = response.data;

			const events = data ? data.flatMap(event => {
				const timeslot = (event.timeslots && event.timeslots[0]);
				const date = mobilizeTimestampToUtcIso(timeslot?.start_date);
				const endDate = mobilizeTimestampToUtcIso(timeslot?.end_date);
				const organization = event.sponsor;

				if (!date || !organization) return [];

				if (activeFilters?.organizations) {
					const {type, list} = activeFilters.organizations;

					if (type === 'allowlist' && !list.includes(organization.slug)) {
						return [];
					}

					if (type === 'blocklist' && list.includes(organization.slug)) {
						return [];
					}
				}

				const calendarEvent: MobilizeCalendarEvent = {
					title: event.title,
					description: event.description,
					date: date,
					endDate: endDate,
					image: event.featured_image_url,
					location: {
						country: event.location?.country,
						state: event.location?.region,
						city: event.location?.locality,
						address: event.location?.address_lines?.filter(Boolean).join(', '),
						postalCode: event.location?.postal_code,
						venue: event.location?.venue
					},
					mobilizeId: event.id,
					organization: {
						id: organization.id,
						name: organization.name,
						url: organization.event_feed_url,
						slug: organization.slug,
					},
					url: event.browser_url,
					eventType: event.event_type,
					source: 'mobilize' as const
				};

				return calendarEvent;
			}) : [];

			allEvents.push(...events);

			nextUrl = next;

			if (nextUrl) {
				// Delay to avoid hitting rate limits (5 requests per second = 200ms delay)
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}

		return {data: allEvents};
	} catch (error) {
		if (error instanceof Error) {
			console.error('Failed to fetch mobilize events:', error);
			throw error;
		}
		throw new Error('Unknown error fetching Mobilize events');
	}
}

/**
 * Mobilize Events API Proxy Endpoint
 */
app.get('/mobilize-events', async (req: Request<{}, {}, {}, EventsApiQueryParams>, res: Response) => {
	try {
		const result = await fetchMobilizeEvents(req.query);
		res.json(result);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({error: 'Failed to fetch Mobilize events', details: error.message});
		}
	}
});

/**
 * Mobilize Organizations API Proxy Endpoint
 * Fetches all unique organizations from Mobilize events within a +/- 6 month range
 */
app.get('/mobilize-organizations', async (req: Request<{}, {}, {}, EventsApiQueryParams>, res: Response) => {
	try {
		const result = await fetchMobilizeEvents(req.query);
		const events = result.data;

		// Extract unique organizations from Mobilize events
		const organizationsMap = new Map();
		events.forEach(event => {
			if (event.source === 'mobilize' && event.organization) {
				organizationsMap.set(event.organization.id, event.organization);
			}
		});

		const uniqueOrganizations = Array.from(organizationsMap.values()).map(org => ({
			id: String(org.id),
			name: org.name,
			slug: org.slug,
			link: org.url
		}));

		res.json({items: uniqueOrganizations});
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({error: 'Failed to fetch Mobilize organizations', details: error.message});
		}
	}
});

/**
 * Google Calendar API Proxy Endpoint
 */
app.get('/google-calendar', async (req: Request<{}, {}, {}, EventsApiQueryParams>, res: Response) => {
	const result = await fetchGoogleCalendarEvents(req.query);

	res.json(result);
});

// 404 handler
app.use((req, res) => {
	res.status(404).json({error: 'Not found'});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
