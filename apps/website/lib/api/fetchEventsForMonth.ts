import {
	CalendarEvents,
	LocalCalendarEvent,
	MobilizeCalendarEvent,
	MobilizeEventType
} from "@connect-utah-today/api/types";
import {getPayload} from "payload";
import config from "@/payload.config";

export const fetchEventsForMonth = async ({ year, month }: { year: number; month: number;
}): Promise<CalendarEvents> => {
  const payload = await getPayload({ config });

  const eventsConfig = await payload.findGlobal({
    slug: 'event-settings',
  });

  const start = new Date(year, month, 1).toISOString();
  const end = new Date(year, month + 1, 1).toISOString();

  const allEvents: CalendarEvents = [];

  // Fetch local events
  if (eventsConfig?.localEvents?.enableLocalEvents) {
    const localEvents = await payload.find({
      collection: 'events',
      where: {
        and: [
          {
            source: { equals: 'local' }
          },
          {
            date: { greater_than_equal: start }
          },
          {
            date: { less_than: end }
          }
        ]
      },
      depth: 1,
      limit: 0,
    });

    const calendarEvents: LocalCalendarEvent[] = localEvents.docs.flatMap(event => {
      if (event.source !== 'local' || !event.local) return [];

      const organization = event.local.organization && typeof event.local.organization === 'object' ? event.local.organization : undefined;
      const images = event.local.images;
      const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : undefined;
      const image = firstImage ? (typeof firstImage === "object" ? (firstImage as any).url : firstImage) : undefined;

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        endDate: event.endDate || undefined,
        url: event.url,
        source: "local",
        image: image || undefined,
        organization: organization ? {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          url: organization.url,
        } : undefined,
        eventType: event.eventType || undefined
      }
    });

    allEvents.push(...calendarEvents);
  }

  // Fetch Mobilize events
  if (eventsConfig?.mobilize?.enableMobilize) {
    const mobilizeEvents = await payload.find({
      collection: 'events',
      where: {
        and: [
          {
            source: { equals: 'mobilize' }
          },
          {
            date: { greater_than_equal: start }
          },
          {
            date: { less_than: end }
          }
        ]
      },
      depth: 1,
      limit: 0,
    });

    const calendarEvents: MobilizeCalendarEvent[] = mobilizeEvents.docs.flatMap(event => {
      if (event.source !== 'mobilize' || !event.mobilize) return [];

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
        mobilizeId: event.mobilize.eventId,
        organization: {
          id: organization.orgId,
          name: organization.name,
          slug: organization.slug,
          url: organization.url,
        },
        eventType: event.eventType as MobilizeEventType | undefined
      }
    });

    allEvents.push(...calendarEvents);
  }


  // Fetch Google Calendar events from API proxy (not synced yet)
  // if (eventsConfig?.googleCalendar?.enableGoogleCalendar) {
  //   const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://connectutahtoday-1.onrender.com/api';
  //   const queryParams = new URLSearchParams({ timeMin: start, timeMax: end });
  //   queryParams.append('sources', 'googleCalendar');
  //
  //   try {
  //     const apiUrl = `${API_BASE}/all-events?${queryParams.toString()}`;
  //     const res = await fetch(apiUrl, {
  //       next: {
  //         revalidate: 300
  //       }
  //     });
  //
  //     if (res.ok) {
  //       const data: EventsApiResponse = await res.json();
  //       allEvents.push(...(data.items || []).filter(e => e.source === 'google'));
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch Google Calendar events:', error);
  //   }
  // }

  // Sort events by date
  allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return allEvents;
}
