import {CalendarEvents} from "@cut/api/types";
import styles from './List.module.scss';
import {getEventImage} from "@/lib/getEventImage";

const EventItem = ({ event }: { event: any }) => {
  const date = event.date ? new Date(event.date).toDateString() : 'Date TBD';

  const summary = event.summary || event.title || '';
  const description = event.description || '';
  const imageURL = event.image || getEventImage(event);

  return (
    <li className={styles.eventItem}>
      <div className={styles.eventContent}>
        <div className={styles.eventImageContainer}>
          <img src={imageURL} alt={summary} className={styles.eventImage} />
        </div>
        <div className={styles.eventDetails}>
          <div className={styles.eventSummary}>
            {date} — {summary}
          </div>
          <div className={styles.eventMeta}>
            <span><strong>Organization:</strong> {event.org || 'Unknown'}</span>
            <span><strong>Type:</strong> {event.event_type || 'Other'}</span>
            {event.url && <span><a href={event.url} target={"_blank"} rel={"noopener"} className={styles.eventLink}>Event Link</a></span>}
          </div>
          <p className={styles.eventDescription}>{description}</p> {/* TODO: Add markdown formatting */}
        </div>
      </div>
    </li>
  );
};

export const EventList = ({ events, date }: { events: CalendarEvents, date: { year: number; month: number; }}) => {
  return (
    <ul className={styles.eventFeed}>
      {events.map((event, index) => (
        <EventItem key={index} event={event} />
      ))}
    </ul>
  );
}
