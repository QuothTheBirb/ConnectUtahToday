import {memo, useMemo, useState} from "react";

import styles from './Calendar.module.scss';
import {EventDetailsPopover} from "@/components/Events/Views/Calendar/DayDetails";
import {CalendarEvent} from "@connect-utah-today/api/types";

type DayEventsProps = {
  events: CalendarEvent[];
}
const DayEvents = ({events}: DayEventsProps) => {
  const visibleEvents = events.slice(0, 3);
  const remainingEventsCount = events.length - visibleEvents.length;

  const getEventLabel = (event: CalendarEvent) => {
    // const label = [event.organization?.name, event.title || 'Event'].filter(Boolean).join(': ');
    const label = `${event.title}`

    return label.length > 24 ? `${label.substring(0, 23)}…` : label;
  }

  return (
    <>
      <div className={styles.events}>
        {visibleEvents.map((event, index) => (
          <div key={index} className={styles.event}>
            {getEventLabel(event)}
          </div>
        ))}
        {remainingEventsCount > 0 && (
          <div className={styles.remaining}>
            +{remainingEventsCount}
          </div>
        )}
      </div>
      <div className={styles.mobileDots}>
        {events.map((event, index) => (
          <div key={index} className={styles.dot} />
        ))}
      </div>
      <div className={styles.eventCount}>
        {events.length} event{events.length !== 1 ? 's' : ''}
      </div>
    </>
  )
}

type CalendarDayProps = {
  dayOfMonth: number;
  date: Date;
  isToday: boolean;
  dayEvents: CalendarEvent[];
  onDayClick?: (events: CalendarEvent[], date: Date) => void;
};
const CalendarDay = ({ dayOfMonth, date, isToday, dayEvents, onDayClick }: CalendarDayProps) => {
  const hasEvents = dayEvents.length > 0;

  const handleDayClick = () => {
    if (hasEvents && onDayClick) {
      onDayClick(dayEvents, date);
    }
  };

  return (
    <div
      className={`${styles.calendarCell} ${isToday ? styles.today : ''} ${hasEvents ? styles.hasEvents : ''}`}
      onClick={handleDayClick}
    >
      <div className={`${styles.dayNumber} ${isToday ? styles.today : ''}`}>{dayOfMonth}</div>
      {hasEvents && <DayEvents events={dayEvents} />}
    </div>
  );
}

const CalendarGrid = memo(({
  year,
  month,
  eventsByDate,
  onDayClick
}: {
  year: number;
  month: number;
  eventsByDate: Record<string, CalendarEvent[]>;
  onDayClick?: (events: CalendarEvent[], date: Date) => void;
}) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) {
      return <div key={`empty-${i}`} className={`${styles.calendarCell} ${styles.empty}`} />;
    }

    const dayOfMonth = i - firstDay + 1;
    const date = new Date(year, month, dayOfMonth);
    const dayEvents = eventsByDate[date.toDateString()] || [];
    const isToday = date.toDateString() === today.toDateString();

    return (
      <CalendarDay
        key={dayOfMonth}
        dayOfMonth={dayOfMonth}
        date={date}
        isToday={isToday}
        dayEvents={dayEvents}
        onDayClick={onDayClick}
      />
    );
  });

  return (
    <div className={styles.calendarGrid}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className={styles.dayHeader}>
          {day}
        </div>
      ))}
      <div className={styles.calendarGridDays}>
        {days}
      </div>
    </div>
  );
});
CalendarGrid.displayName = 'CalendarGrid';

type CalendarProps = {
  events: CalendarEvent[];
  date: {
    year: number;
    month: number;
  };
}
export const EventCalendar = (
  {
    events,
    date,
  }: CalendarProps
) => {
  const { year, month } = date;
  const [eventDetails, setEventDetails] = useState<{events: CalendarEvent[]; date: Date} | null>(null);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      if (isNaN(eventDate.getTime())) return acc;

      const dateKey = eventDate.toDateString();

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(event);

      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [events]);

  const handleDayClick = (events: CalendarEvent[], date: Date) => {
    setEventDetails({ events, date });
  };

  return (
    <div className={styles.calendarContainer}>
      <h2 className={styles.calendarMonthYear}>{
        new Date(year, month).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      }</h2>
      <CalendarGrid
        year={year}
        month={month}
        eventsByDate={eventsByDate}
        onDayClick={handleDayClick}
      />
      <EventDetailsPopover
        eventDetails={eventDetails}
        setEventDetails={setEventDetails}
      />
      <div className={styles.detailsInfo}>
        <p>Click on a day with events to see event details.</p>
      </div>
    </div>
  );
};
