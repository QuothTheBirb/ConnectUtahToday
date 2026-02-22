"use client";

import {useSearchParams} from 'next/navigation';
import Link from 'next/link';

import styles from '../Events.module.scss';
import {EventCalendar} from "@/components/Events/Views/Calendar";
import {EventList} from "@/components/Events/Views/List";
import {CalendarEvent} from "@connect-utah-today/api/types";

export const EventsViews = ({
  events,
  date: {
    year,
    month
  },
}: {
  events: CalendarEvent[];
  date: {
    year: number;
    month: number;
  }
}) => {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'list';

  const params = new URLSearchParams(searchParams.toString());
  params.delete('view');
  const queryString = params.toString();

  return (
    <div className={styles.eventsView}>
      <div className={styles.viewTabs}>
        <Link
          href={`/events${queryString && `?${queryString}`}`} className={`${styles.viewTab}${view === 'list' ? ` ${styles.active}` : ''}`}
          scroll={false}
        >
          Events List {/* Later change to "Upcoming Events" when filters are set to only show upcoming events */}
        </Link>
        <Link
          href={`/events?view=calendar${queryString && `&${queryString}`}`} className={`${styles.viewTab}${view === 'calendar' ? ` ${styles.active}` : ''}`}
          scroll={false}
        >
          Event Calendar
        </Link>
      </div>
      {view === 'calendar' ? (
        <EventCalendar events={events} date={{year, month}} />
      ) : (
        <EventList events={events} date={{ year, month }} />
      )}
    </div>
  )
}
