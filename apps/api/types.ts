import {calendar_v3} from 'googleapis';

// Mobilize API Event Types
// Reference: https://github.com/mobilizeamerica/api?tab=readme-ov-file#events
export type MobilizeEventType = "CANVASS" | "PHONE_BANK" | "TEXT_BANK" | "MEETING" | "COMMUNITY" | "FUNDRAISER" | "MEET_GREET" | "HOUSE_PARTY" | "VOTER_REG" | "TRAINING" | "FRIEND_TO_FRIEND_OUTREACH" | "DEBATE_WATCH_PARTY" | "ADVOCACY_CALL" | "RALLY" | "TOWN_HALL" | "OFFICE_OPENING" | "BARNSTORM" | "SOLIDARITY_EVENT" | "COMMUNITY_CANVASS" | "SIGNATURE_GATHERING" | "CARPOOL" | "WORKSHOP" | "PETITION" | "AUTOMATED_PHONE_BANK" | "LETTER_WRITING" | "LITERATURE_DROP_OFF" | "VISIBILITY_EVENT" | "OTHER";
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
    state?: string;
  }
  timeslots: {
    start_date: number;
    end_date: number;
  }[]
  event_type: MobilizeEventType;
  browser_url: string;
}
export type MobilizeApiEventsResponse = {
  data: MobilizeApiEvent[];
  count: number;
  next: string | null;
  previous: string | null;
}
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
}

export type LocalCalendarEvent = BaseCalendarEvent & {
  source: "local";
  mobilizeId?: never;
  googleCalendarId?: never;
  image?: string;
  organization?: {
    name: string;
    id?: string;
    url?: string;
    slug?: string;
    state?: string;
  }
  eventType?: string;
}
export type MobilizeCalendarEvent =  BaseCalendarEvent & {
  source: "mobilize";
  image?: string;
  mobilizeId: number;
  googleCalendarId?: never;
  organization: {
    id: number;
    name: string;
    slug: string;
    url: string;
    state?: string;
  }
  eventType?: MobilizeEventType;
}
export type GoogleCalendarEvent = BaseCalendarEvent &  {
  source: "google";
  image?: string;
  mobilizeId?: never;
  googleCalendarId: string;
  organization: {
    id?: string;
    name?: string;
    url?: never;
    slug?: never;
    state?: never;
  }
  eventType: "CUTCOMMUNITY";
}

export type CalendarEvent = LocalCalendarEvent | MobilizeCalendarEvent | GoogleCalendarEvent;
export type CalendarEvents = Array<LocalCalendarEvent | MobilizeCalendarEvent | GoogleCalendarEvent>;

// Events API
export type EventsApiQueryParams = {
  timeMin?: string;
  timeMax?: string;
  state?: string;
  sources?: ('local' | 'mobilize' | 'googleCalendar')[]
  googleCalendar?: {
    apiKey?: string;
    calendarId?: string;
  }
  mobilize?: {
    apiKey?: string;
    filters: {
      state?: string;
      organizations?: {
        type: "allowlist" | 'blocklist';
        list: string[];
      }
    }
  }
}

export type MobilizeEventsApiResponse = {
  data: MobilizeCalendarEvent[];
}
export type EventsApiResponse = {
  data: CalendarEvents;
}
