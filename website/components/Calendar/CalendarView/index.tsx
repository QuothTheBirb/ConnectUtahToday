import {CSSProperties, memo, useMemo} from "react";

import {CalendarEvent} from "@cut/api/types";
import {MonthNavigation} from "@/components/Calendar/CalendarView/MonthNavigation";
import styles from '../EventCalendar.module.scss';

type DayEventsProps = {
  events: CalendarEvent[];
}
const DayEvents = ({events}: DayEventsProps) => {
  const visibleEvents = events.slice(0, 3);
  const remainingEventsCount = events.length - visibleEvents.length;

  const getEventLabel = (event: CalendarEvent) => {
    const label = [event.org, event.title || 'Event'].filter(Boolean).join(': ');

    return label.length > 24 ? `${label.substring(0, 23)}…` : label;
  }

  return (
    <>
      <div className={styles.events}>
        {visibleEvents.map((event) => (
          <div key={event.id} className={styles.event}>
            {getEventLabel(event)}
          </div>
        ))}
        {remainingEventsCount > 0 && (
          <div style={{ fontSize: '10px', color: '#1976d2', fontWeight: 'bold' }}>
            +{remainingEventsCount}
          </div>
        )}
      </div>
      <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
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
  const cellStyle: CSSProperties = {
    ...(isToday && { background: '#e3f2fd' }),
    ...(hasEvents && { cursor: 'pointer' }),
  };

  const handleDayClick = () => {
    if (hasEvents && onDayClick) {
      onDayClick(dayEvents, date);
    }
  };

  return (
    <div
      className={styles.calendarCell}
      style={cellStyle}
      onClick={handleDayClick}
    >
      <div style={{ fontWeight: isToday ? 'bold' : 'normal' }}>{dayOfMonth}</div>
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
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const today = new Date();

  const days = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) {
      return <div key={`empty-${i}`} className={styles.calendarCell} style={{ background: '#f9f9f9' }} />;
    }

    const dayOfMonth = i - firstDay + 1;
    const date = new Date(Date.UTC(year, month, dayOfMonth));
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
  onDayClick?: (events: CalendarEvent[], date: Date ) => void;
}
export const Calendar = (
  {
    events,
    date,
    onDayClick,
  }: CalendarProps
) => {
  const { year, month } = date;

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

  return (
    <div className={styles.calendarContainer}>
      <MonthNavigation date={{ year, month }} />
      <CalendarGrid
        year={year}
        month={month}
        eventsByDate={eventsByDate}
        onDayClick={onDayClick}
      />
      <div className={styles.detailsInfo}>
        <p>Click on a day with events to see event details.</p>
      </div>
    </div>
  );
};
