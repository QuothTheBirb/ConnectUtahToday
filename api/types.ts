// Mobilize API Event Types
// Reference: https://github.com/mobilizeamerica/api?tab=readme-ov-file#events
type MobilizeEventType = "CANVASS" | "PHONE_BANK" | "TEXT_BANK" | "MEETING" | "COMMUNITY" | "FUNDRAISER" | "MEET_GREET" | "HOUSE_PARTY" | "VOTER_REG" | "TRAINING" | "FRIEND_TO_FRIEND_OUTREACH" | "DEBATE_WATCH_PARTY" | "ADVOCACY_CALL" | "RALLY" | "TOWN_HALL" | "OFFICE_OPENING" | "BARNSTORM" | "SOLIDARITY_EVENT" | "COMMUNITY_CANVASS" | "SIGNATURE_GATHERING" | "CARPOOL" | "WORKSHOP" | "PETITION" | "AUTOMATED_PHONE_BANK" | "LETTER_WRITING" | "LITERATURE_DROP_OFF" | "VISIBILITY_EVENT" | "OTHER";
export type MobilizeEvents = {
  data: {
    id: string;
    title: string;
    description: string;
    featured_image_url: string;
    sponsor?: {
      name: string;
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

type BaseEvent = {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  url: string;
}
export type CalendarEvent = BaseEvent & ({
  source: "mobilize";
  image: string;
  org?: string;
  event_type: MobilizeEventType;
} | {
  source: "google";
  image?: string | null;
  org: 'Connect Utah Today';
  event_type: "CUTCOMMUNITY";
})
export type CalendarEvents = CalendarEvent[] | [];

// Events API
export type EventsApiQueryParams = {
  timeMin?: string;
  timeMax?: string;
}
export type EventsApiResponse = {
  items: CalendarEvents;
}
