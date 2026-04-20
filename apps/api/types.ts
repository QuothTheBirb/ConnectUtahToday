import { calendar_v3 } from "googleapis"; // Mobilize API Event Types

// Mobilize API Event Types
// Reference: https://github.com/mobilizeamerica/api?tab=readme-ov-file#events
export type MobilizeEventType =
	| "CANVASS"
	| "PHONE_BANK"
	| "TEXT_BANK"
	| "MEETING"
	| "COMMUNITY"
	| "FUNDRAISER"
	| "MEET_GREET"
	| "HOUSE_PARTY"
	| "VOTER_REG"
	| "TRAINING"
	| "FRIEND_TO_FRIEND_OUTREACH"
	| "DEBATE_WATCH_PARTY"
	| "ADVOCACY_CALL"
	| "RALLY"
	| "TOWN_HALL"
	| "OFFICE_OPENING"
	| "BARNSTORM"
	| "SOLIDARITY_EVENT"
	| "COMMUNITY_CANVASS"
	| "SIGNATURE_GATHERING"
	| "CARPOOL"
	| "WORKSHOP"
	| "PETITION"
	| "AUTOMATED_PHONE_BANK"
	| "LETTER_WRITING"
	| "LITERATURE_DROP_OFF"
	| "VISIBILITY_EVENT"
	| "OTHER";
export type MobilizeApiEvent = {
	id: number;
	title: string;
	description: string;
	featured_image_url?: string;
	sponsor?: {
		id: number;
		name: string;
		event_feed_url: string;
		slug: string;
	};
	location?: {
		country: string;
		region: string; // The state
		locality: string; // The city
		address_lines: string[];
		postal_code: string;
		venue: string; // Meeting location
	} | null;
	timeslots: {
		start_date: number;
		end_date: number;
	}[];
	event_type: MobilizeEventType;
	browser_url: string;
};
export type MobilizeApiEventsResponse = {
	data: MobilizeApiEvent[];
	count: number;
	next: string | null;
	previous: string | null;
};
// Google Calendar API Event Types
// Reference: https://developers.google.com/calendar/api/v3/reference/events
export type GoogleCalendarApiEvent = calendar_v3.Schema$Event;
export type GoogleCalendarApiEventsResponse = calendar_v3.Schema$Events;

type BaseCalendarEvent = {
	title: string;
	description?: string;
	date: string;
	endDate?: string;
	url: string;
	location?: {
		country?: string;
		state?: string;
		city?: string;
		address?: string;
		postalCode?: string;
		venue?: string; // Meeting location
	};
};

export type LocalCalendarEvent = BaseCalendarEvent & {
	source: "local";
	image?: string; // Unsure on this type
	organization: {
		id: string;
		name: string;
		url?: string; // TODO: Unsure on this one, is it url for the site or for the contact page (as currently implemented)?
		slug: string;
	};
	eventType?: never;
	mobilizeId?: never;
	googleCalendarId?: never;
};
export type MobilizeCalendarEvent = BaseCalendarEvent & {
	source: "mobilize";
	image?: string;
	organization: {
		id: number;
		name: string;
		url: string;
		slug: string;
	};
	eventType?: MobilizeEventType;
	googleCalendarId?: never;
	mobilizeId: number;
};
export type GoogleCalendarEvent = BaseCalendarEvent & {
	source: "googleCalendar";
	image?: string;
	organization?: {
		id: string;
		name: string;
		url?: string;
		slug: string;
	};
	mobilizeId?: never;
	googleCalendarId: string;
	eventType?: never;
};

export type CalendarEvent =
	| LocalCalendarEvent
	| MobilizeCalendarEvent
	| GoogleCalendarEvent;
export type CalendarEvents = Array<
	LocalCalendarEvent | MobilizeCalendarEvent | GoogleCalendarEvent
>;
