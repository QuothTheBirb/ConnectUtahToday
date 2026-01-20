import {calendar_v3} from 'googleapis';

// Mobilize API Event Types
// Reference: https://github.com/mobilizeamerica/api?tab=readme-ov-file#events
type MobilizeEventType = "CANVASS" | "PHONE_BANK" | "TEXT_BANK" | "MEETING" | "COMMUNITY" | "FUNDRAISER" | "MEET_GREET" | "HOUSE_PARTY" | "VOTER_REG" | "TRAINING" | "FRIEND_TO_FRIEND_OUTREACH" | "DEBATE_WATCH_PARTY" | "ADVOCACY_CALL" | "RALLY" | "TOWN_HALL" | "OFFICE_OPENING" | "BARNSTORM" | "SOLIDARITY_EVENT" | "COMMUNITY_CANVASS" | "SIGNATURE_GATHERING" | "CARPOOL" | "WORKSHOP" | "PETITION" | "AUTOMATED_PHONE_BANK" | "LETTER_WRITING" | "LITERATURE_DROP_OFF" | "VISIBILITY_EVENT" | "OTHER";
export type MobilizeEvents = {
  data: {
    id: string;
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
  }[];
  count: number;
  next: string | null;
  previous: string | null;
}
// Google Calendar API Event Types
// Reference: https://developers.google.com/calendar/api/v3/reference/events
export type GoogleCalendarEvents = calendar_v3.Schema$Events;

type BaseCalendarEvent = {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  url: string;
}
type MobilizeCalendarEvent =  BaseCalendarEvent & {
  source: "mobilize";
  image?: string;
  organization: {
    id: number;
    name: string;
    slug: string;
    url: string;
    state?: string;
  }
  event_type: MobilizeEventType;
}
type GoogleCalendarEvent = BaseCalendarEvent &  {
  source: "google";
  image?: string;
  organization: {
    id?: string;
    name?: string;
    url?: never;
    slug?: never;
    state?: never;
  }
  event_type: "CUTCOMMUNITY";
}

export type CalendarEvent = MobilizeCalendarEvent | GoogleCalendarEvent;
export type CalendarEvents = CalendarEvent[] | [];

// Events API
export type EventsApiQueryParams = {
  timeMin?: string;
  timeMax?: string;
}
export type EventsApiResponse = {
  items: CalendarEvents;
}
