'use client';

import {useCallback, useMemo, useState} from 'react';
import styles from './UpcomingEvents.module.scss';
import {CalendarEvent, CalendarEvents} from "@cut/api/types";
import {EventsDisclaimer} from "@/components/EventsDisclaimer";
import {imageMap} from "@/components/UpcomingEvents/imageMap";
import {FiltersForm} from "@/components/FilterForm";
import {OrganizationFilter} from "@/components/FilterForm/Filters/SelectOrg";
import {DateRangeFilter} from "@/components/FilterForm/Filters/DateRange";

// --- Date utility functions ---
// const parseEventDate = (event: any): Date | null => {
//   if (!event.date) return null;
//   let date;
//   if (typeof event.date === 'string') {
//     date = new Date(event.date);
//   } else {
//     date = event.date;
//   }
//   if (isNaN(date.getTime())) return null;
//   return date;
// };
//
// const getDateKey = (date: Date) => {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
// };
//
// const getWeekKey = (date: Date) => {
//   const startOfWeek = new Date(date);
//   startOfWeek.setDate(date.getDate() - date.getDay());
//   return getDateKey(startOfWeek);
// };
//
// const getMonthKey = (date: Date) => {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// };
//
// const isDateInRange = (eventDate: Date, startDate: Date, endDate: Date) => {
//   return eventDate >= startDate && eventDate <= endDate;
// };
//
const getMatchingImage = (summary = '', description = '') => {
  const text = `${summary} ${description}`.toLowerCase();
  for (const keyword in imageMap) {
    if (keyword !== 'default' && text.includes(keyword.toLowerCase())) {
      return imageMap[keyword as keyof typeof imageMap];
    }
  }
  return imageMap['default'];
};

const EventItem = ({ event }: { event: any }) => {
  const date = event.date
    ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBD';
  const summary = event.summary || event.title || '';
  const description = event.description || '';
  const imageURL = event.image || getMatchingImage(summary, description);

  return (
    <li className={styles.eventItem}>
      <div className={styles.eventImageContainer}>
        <img src={imageURL} alt={summary} />
      </div>
      <div className={styles.eventDetails}>
        <div className={styles.eventSummary}>
          {date} — {summary}
        </div>
        <div className={styles.eventMeta}>
          <strong>Organization:</strong> {event.org || 'Unknown'}<br />
          <strong>Type:</strong> {event.event_type || 'Other'}
          {event.url && <><br /><a href={event.url} target="_blank" rel="noopener noreferrer">Event Link</a></>}
        </div>
        <p className={styles.eventDescription} dangerouslySetInnerHTML={{ __html: description }}></p>
      </div>
    </li>
  );
};

export const UpcomingEvents = ({ monthEvents, date }: { monthEvents: CalendarEvents, date: { year: number; month: number; }}) => {
  const { year, month } = date;

  const [ selectedOrg, setSelectedOrg ] = useState("");
  const [ dateRange, setDateRange ] = useState({
    start: "",
    end: ""
  });
  const [ appliedFilters, setAppliedFilters ] = useState({
    org: "",
    dateRange: { start: "", end: "" }
  });

  const orgOptions = useMemo(() => {
    if (!monthEvents) return [];

    const organizations = new Set<string>();

    monthEvents.forEach(event => {
      if (event.org && event.org !== '') {
        organizations.add(event.org.trim());
      }
    });

    return Array.from(organizations).sort((a, b) => a.localeCompare(b));
  }, [monthEvents]);

  const events = useMemo(() => {
    return monthEvents.filter((event) => {
      // Filter by applied org
      const matchesOrg = appliedFilters.org === "" || (event.org || '').trim() === appliedFilters.org;

      // Filter by applied date range
      const start = appliedFilters.dateRange.start ? new Date(appliedFilters.dateRange.start) : undefined;
      const end = appliedFilters.dateRange.end ? new Date(appliedFilters.dateRange.end) : undefined;
      if (end) end.setUTCHours(23, 59, 59, 999);

      const eventDate = new Date(event.date);
      const withinDateRange = (!start || eventDate >= start) && (!end || eventDate <= end);

      return matchesOrg && withinDateRange;
    })
  }, [monthEvents, appliedFilters]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const d = new Date(event.date);
      if (isNaN(d.getTime())) return acc;

      const eventDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const dateKey = eventDay.toDateString();

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(event);

      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [events]);

  const applyFilters = useCallback(() => {
    setAppliedFilters({
      org: selectedOrg,
      dateRange: dateRange,
    });
  }, [selectedOrg, dateRange]);

  const clearFilters = useCallback(() => {
    setSelectedOrg("");
    setDateRange({ start: "", end: "" });
    setAppliedFilters({
      org: "",
      dateRange: { start: "", end: "" },
    });
  }, []);

  return (
    <>
        <EventsDisclaimer />
        {/*<div className={styles.monthNavigation}>*/}
        {/*  <button onClick={handlePrevMonth} disabled={loading}>&#8592; Previous Month</button>*/}
        {/*  <span>{currentMonthLabel}</span>*/}
        {/*  <button onClick={handleNextMonth} disabled={loading}>Next Month &#8594;</button>*/}
        {/*</div>*/}
      <FiltersForm applyFilters={applyFilters} clearFilters={clearFilters}>
        <OrganizationFilter
          orgOptions={orgOptions}
          selectedOrg={selectedOrg}
          setSelectedOrg={setSelectedOrg}
        />
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </FiltersForm>
        <div className={styles.eventFeed}>
          <h2>Events</h2>
          <div>
            {events.map((event, index) => (
              <EventItem key={index} event={event} />
            ))}
          </div>
        </div>
    </>
  );
}
