import axios, {AxiosResponse} from 'axios';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config';
import type {Request, Response} from 'express';
import express from 'express';
import {Pool} from 'pg';

import {CalendarEvent, EventsApiQueryParams, EventsApiResponse, GoogleCalendarEvents, MobilizeEvents} from "./types";
import {googleCalendarDateToUtcIso, mobilizeTimestampToUtcIso} from "../utils/toUtcIsoString";

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
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// API to verify org-signin password
app.post('/org-signin', async (req, res) => {
  const { password } = req.body;
  try {
    const result = await pool.query('SELECT password_hash FROM password LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(500).json({ success: false, message: 'No password set' });
    }
    const hashedPassword = result.rows[0].password_hash;
    const match = await bcrypt.compare(password, hashedPassword);
    if (match) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error verifying password:', error.stack || error);
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API to get all organizations
app.get('/organizations', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, link FROM organizations ORDER BY name`);
    console.log('DEBUG organizations:', result.rows);
    res.json({ items: result.rows });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching organizations:', error.stack || error);
    }

    res.status(500).json({ error: 'Could not fetch organizations' });
  }
});

// API to add a new organization
app.post('/organizations', async (req, res) => {
  const { name, link } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Organization name is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO organizations (name, link) VALUES ($1, $2) RETURNING id', [name, link || null]
    )
    res.json({ id: result.rows[0].id });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding organization:', error.stack || error);
      res.status(500).json({ error: 'Could not add organization' });
    }
  }
});

// API to get volunteer opportunities for an organization by organization_id
app.get('/opportunities', async (req, res) => {
  const { organization_id } = req.query;
  if (!organization_id) {
    return res.status(400).json({ error: 'organization_id is required' });
  }
  try {
    const result = await pool.query(
      'SELECT opportunity FROM opportunities WHERE organization_id = $1',
      [organization_id]
    );
    res.json({ items: result.rows.map(row => row.opportunity) });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching opportunities:', error.stack || error);
    }

    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// remove opportunity for an organization
app.delete('/opportunities', async (req, res) => {
  const organization_id = req.body.organization_id || req.query.organization_id;
  const opportunities = req.body.opportunities || req.query.opportunities;

  // Ensure opportunities is an array
  if (!organization_id || !Array.isArray(opportunities) || opportunities.length === 0) {
    return res.status(400).json({ error: 'organization_id and opportunities array are required' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM opportunities WHERE organization_id = $1 AND opportunity = ANY($2::text[])',
      [organization_id, opportunities]
    );
    res.json({ success: true, deleted: result.rowCount });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting opportunities:', error.stack || error);
    }

    res.status(500).json({ error: 'Failed to delete opportunities' });
  }
});


// API to add a new opportunity for an organization
app.post('/opportunities', async (req, res) => {
  const { organization_id, opportunity } = req.body;
  if (!organization_id || !opportunity) {
    return res.status(400).json({ error: 'organization_id and opportunity are required' });
  }
  try {
    await pool.query(
      'INSERT INTO opportunities (organization_id, opportunity) VALUES ($1, $2)',
      [organization_id, opportunity]
    );
    res.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding opportunity:', error.stack || error);
    }

    res.status(500).json({ error: 'Failed to add opportunity' });
  }
});

/**
 * Google Calendar API Proxy (production)
 */
async function fetchGoogleCalendarEvents(reqQuery: EventsApiQueryParams): Promise<EventsApiResponse> {
  const { timeMin, timeMax } = reqQuery;
  const calendarId = '889b58a5eb5476990c478facc6e406cf64ca2d7ff73473cfa4b24f435b895d00@group.calendar.google.com';
  const apiKey = process.env.GOOGLECALENDAR_API_KEY;

  if (!apiKey) {
    console.log('Google Calendar API key not found in environment variables');
    return { items: [] };
  }

  let url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}`;
  if (timeMin) url += `&timeMin=${encodeURIComponent(timeMin)}`;
  if (timeMax) url += `&timeMax=${encodeURIComponent(timeMax)}`;
  url += '&singleEvents=true&orderBy=startTime';

  try {
    const response: AxiosResponse<GoogleCalendarEvents> = await axios.get(url);

    const events: CalendarEvent[] = response.data.items ? response.data.items.flatMap((event) => {
      const date = googleCalendarDateToUtcIso(event.start);
      const endDate = googleCalendarDateToUtcIso(event.end);

      if (!event.id || !date || !event.summary || !event.htmlLink) return [];

      return {
        id: event.id,
        title: event.summary,
        description: event.description || undefined,
        date: date,
        endDate: endDate,
        image: null,
        org: 'Connect Utah Today',
        url: event.htmlLink,
        event_type: 'CUTCOMMUNITY',
        source: 'google'
      }
    }) : []

    return { items: events };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching Google Calendar events:', error.message);
    }

    return { items: [] };
  }
}

/**
 * Mobilize Events API Proxy Endpoint
 */
app.get('/mobilize-events', async (req: Request<{}, {}, {}, EventsApiQueryParams>, res: Response) => {
  console.log('=== MOBILIZE API REQUEST ===');
  console.log('Query params:', req.query);

  const { timeMin, timeMax } = req.query;

  // Convert ISO8601 to UNIX timestamp (seconds)
  const start = timeMin ? Math.floor(new Date(timeMin).getTime() / 1000) : undefined;
  const end = timeMax ? Math.floor(new Date(timeMax).getTime() / 1000) : undefined;

  console.log('Converted timestamps - start:', start, 'end:', end);

  // Use production or staging API based on environment
  const mobilizeApiBase = process.env.NODE_ENV === 'production'
    ? 'https://api.mobilize.us'
    : 'https://staging-api.mobilize.us';

  let url = `${mobilizeApiBase}/v1/events?`;
  if (start) url += `timeslot_start=gte_${start}&`;
  if (end) url += `timeslot_start=lt_${end}&`;

  console.log('Final API URL:', url);

  try {
    console.log(`Making request to Mobilize ${process.env.NODE_ENV === 'production' ? 'production' : 'staging'} API...`);
    const response: AxiosResponse<MobilizeEvents> = await axios.get(url);
    console.log('Response status:', response.status);
    console.log('Response data length:', response.data?.data?.length || 0);

    // Normalize events to a simpler structure for the frontend
    const events: CalendarEvent[] = response.data.data ? response.data.data.flatMap(event => {
      // Pick the first timeslot for display purposes
      const timeslot = (event.timeslots && event.timeslots[0]);
      const date = mobilizeTimestampToUtcIso(timeslot.start_date);
      const endDate = mobilizeTimestampToUtcIso(timeslot.end_date);
      const org = event.sponsor && event.sponsor.name;

      if (!date || !org) return [];

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: date,
        endDate: endDate,
        image: event.featured_image_url,
        org: org,
        url: event.browser_url,
        event_type: event.event_type,
        source: 'mobilize'
      };
    }) : [];

    console.log('Processed events count:', events.length);
    console.log('Sample event:', events[0] || 'No events');
    console.log('=== MOBILIZE API SUCCESS ===');
    res.json(<EventsApiResponse>{ items: events });
  } catch (error) {
    if (error instanceof Error) {
      console.error('=== MOBILIZE API ERROR ===');
      console.error('Full error:', error);
      res.status(500).json({ error: 'Failed to fetch Mobilize events', details: error.message });
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

/**
 * Combined Events API (aggregates Mobilize and Google Calendar events)
 * Uses internal function calls!
 */
app.get('/all-events', async (req: Request<{}, {}, {}, EventsApiQueryParams>, res: Response) => {
  console.log('=== COMBINED EVENTS REQUEST ===');
  try {
    // Fetch from all three APIs in parallel
    const [mobilizeResponse, googleResponse, imageResponse] = await Promise.allSettled([
      axios.get(`${apiBase}/mobilize-events?${new URLSearchParams(req.query)}`),
      axios.get(`${apiBase}/google-calendar?${new URLSearchParams(req.query)}`),
      axios.get(`${apiBase}/image-events?${new URLSearchParams(req.query)}`)
    ]);

    let allEvents: CalendarEvent[] = [];

    if (mobilizeResponse.status === 'fulfilled') {
      const mobilizeEvents = mobilizeResponse.value.data.items || [];
      allEvents = allEvents.concat(mobilizeEvents);
      console.log('Added mobilize events:', mobilizeEvents.length);
    }
    if (googleResponse.status === 'fulfilled') {
      const googleEvents = googleResponse.value.data.items || [];
      allEvents = allEvents.concat(googleEvents);
      console.log('Added Google Calendar events:', googleEvents.length);
    }
    if (imageResponse.status === 'fulfilled') {
      const imageEvents = imageResponse.value.data.items || [];
      allEvents = allEvents.concat(imageEvents);
      console.log('Added image events:', imageEvents.length);
    } else {
      console.error('Image events fetch failed:', imageResponse);
    }

    // Sort by date
    allEvents.sort((a, b) => {
      const dateA = +new Date(a.date);
      const dateB = +new Date(b.date);

      return dateA - dateB;
    });

    console.log('Total combined events:', allEvents.length);
    console.log('=== COMBINED EVENTS SUCCESS ===');
    res.json(<EventsApiResponse>{ items: allEvents });
  } catch (error) {
    console.error('=== COMBINED EVENTS ERROR ===');
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to fetch combined events', details: error.message });
    }
  }
});

// Image upload Postgres logic
app.post('/images', async (req, res) => {
  const { url, organization, date } = req.body;
  if (!url || !organization || !date) {
    return res.status(400).json({ error: 'url, organization, and date required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO images (url, organization, date) VALUES ($1, $2, $3) RETURNING *',
      [url, organization, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(500).json({ error: 'Error saving image data' });
  }
});

// API to fetch events from images table
app.get('/image-events', async (req, res) => {
  try {
    // Optional filters
    const { org, timeMin, timeMax } = req.query;
    let query = 'SELECT * FROM images';
    const params = [];
    const where = [];
    if (org) {
      where.push('organization ILIKE $' + (params.length + 1));
      params.push(`%${org}%`);
    }
    if (timeMin) {
      where.push('date >= $' + (params.length + 1));
      params.push(timeMin);
    }
    if (timeMax) {
      where.push('date <= $' + (params.length + 1));
      params.push(timeMax);
    }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ' ORDER BY date ASC';

    const result = await pool.query(query, params);

    // Log raw rows from the images table
    console.log('Images table result:', result.rows);

    // Normalize to event structure
    const events = result.rows.map(row => ({
      id: `image-${row.id}`,
      summary: '',
      description: '',
      date: row.date,
      endDate: row.date,
      image: row.url,
      org: row.organization,
      url: row.url,
      event_type: 'image',
      source: 'image'
    }));
    res.json({ items: events });
  } catch (error) {
    console.error('Error fetching image events:', error);
    res.status(500).json({ error: 'Failed to fetch image events' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
