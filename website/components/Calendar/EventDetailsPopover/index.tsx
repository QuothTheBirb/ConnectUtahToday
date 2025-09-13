import {Dispatch, SetStateAction} from "react";

import {CalendarEvent} from "@cut/api/types";
import {orgImageMap} from "./orgImageMap";
import styles from './EventDetails.module.scss';

export const EventDetailsPopover = (
  { eventDetails, setEventDetails }:
  {
    eventDetails: {
      events: CalendarEvent[];
      date: Date;
    } | null;
    setEventDetails:  Dispatch<SetStateAction<{
      events: CalendarEvent[]
      date: Date
    } | null>>
  }
) => {
  if (!eventDetails) return null;

  const { events, date } = eventDetails;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getEventImage = (event: CalendarEvent) => {
    if (event.image) return event.image;
    if (event.source === 'mobilize' && event.image) return event.image;
    if (event.source === 'google') {
      const searchText = `${event.title} ${event.description || ''}`.toLowerCase();
      for (const [org, imagePath] of Object.entries(orgImageMap)) {
        if (searchText.includes(org.toLowerCase())) {
          return imagePath;
        }
      }
    }

    return 'assets/placeholder.jpg';
  };

  const onClose = () => {
    setEventDetails(null);
  };


  return (
    <>
      <div className={`${styles.eventDetailsOverlay} ${styles.popoverVisible}`} onClick={onClose}></div>
      <div className={`${styles.eventDetailsPopover} ${styles.popoverVisible}`}>
        <div className={styles.popoverHeader}>
          <div className={styles.popoverHeaderFlex}>
            <h2 className={styles.eventTitle}>Events</h2>
            <button className={styles.closeButton} onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className={styles.popoverBody}>
            <div className={styles.dateHeader}>
              <h3 className={styles.dateHeaderTitle}>{`${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`}</h3>
              <p className={styles.dateHeaderSubtitle}>{`${events.length} event${events.length !== 1 ? 's' : ''} scheduled`}</p>
            </div>
            {events.map((event, index) => {
              const eventDate = new Date(event.date);
              const shortDesc = event.description && event.description.length > 300
                ? event.description.substring(0, 300) + '...'
                : event.description;
              const eventImage = getEventImage(event);

              return (
                <div key={index}>
                  {index > 0 && <div className={styles.eventSeparator}></div>}
                  <div className={styles.eventCard}>
                    <div className={styles.eventImageContainer}>
                      <img src={eventImage} alt="Event image" className={styles.eventImage} onError={(event) => (event.currentTarget.src = 'assets/placeholder.jpg')}/>
                    </div>
                    <div className={styles.eventDetails}>
                      {event.org && <div className={styles.eventOrg}>{event.org}</div>}
                      <h3 className={styles.eventSummary}>{event.title}</h3>
                      <div className={styles.eventGrid}>
                        {event.date && (
                          <>
                            <span className={styles.eventGridLabel}>📅 Date:</span>
                            <span className={styles.eventGridValue}>{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                            <span className={styles.eventGridLabel}>🕐 Time:</span>
                            <span className={styles.eventGridValue}>{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' })} UTC</span>
                          </>
                        )}
                        {/* Location is not currently returned from the API, to be implemented later. */}
                        {/*{event.location && (*/}
                        {/*  <>*/}
                        {/*    <span className={styles.eventGridLabel}>📍 Location:</span>*/}
                        {/*    <span className={styles.eventGridValue}>{event.location}</span>*/}
                        {/*  </>*/}
                        {/*)}*/}
                        <span className={styles.eventGridLabel}>{event.source === 'google' ? '📅' : '📢'} Source:</span>
                        <span className={styles.eventGridValue}>{event.source === 'google' ? 'Google Calendar' : 'Mobilize'}</span>
                      </div>
                      {shortDesc && <div className={styles.eventDescription} dangerouslySetInnerHTML={{ __html: shortDesc }}></div>}
                      <div className={styles.eventActions}>
                        {event.url && (
                          <a href={event.url} target="_blank" rel="noopener noreferrer" className={styles.viewDetailsButton}>
                            <span>View Details</span> <span style={{ fontSize: '1.1em' }}>→</span>
                          </a>
                        )}
                        {event.source === 'mobilize' && event.event_type && (
                          <span className={styles.eventTypeTag}>{event.event_type}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </>
  );
};
