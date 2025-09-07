"use client";

import {useEffect, useState} from "react";
import {CalendarEvent, EventsApiResponse} from "../../../api/types";
import {useOrgSelect} from "./OrgDropdown/orgDropdown";

export const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [allFetchedEvents, setAllFetchedEvents] = useState<CalendarEvent[]>([]);
  const [filterDateStart, setFilterDateStart] = useState<Date | null>(null);
  const [filterDateEnd, setFilterDateEnd] = useState<Date | null>(null);

  const { selectedOrg, setSelectedOrg, orgOptions } = useOrgSelect(allFetchedEvents)

  const API_BASE =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://connectutahtoday-1.onrender.com';

  useEffect(() => {
    console.log('Pain')

    const fetchEventsForCalendar = async () => {
      try {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        let start, end;

        if (filterDateStart && filterDateEnd) {
          start = filterDateStart;
          end = filterDateEnd;
          end.setHours(23, 59, 59, 999);
        } else {
          start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
          end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
        }

        const timeMin = encodeURIComponent(start.toISOString());
        const timeMax = encodeURIComponent(end.toISOString());
        const apiURL = `${API_BASE}/api/all-events?timeMin=${timeMin}&timeMax=${timeMax}`;
        const response = await fetch(apiURL);

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        const data: EventsApiResponse = await response.json();

        console.log(data)

        data.items && setAllFetchedEvents(data.items.map(event => event));
      } catch (error) {
        setAllFetchedEvents([]);
      }
    }

    fetchEventsForCalendar();

    return () => {}
  }, [currentDate]);

  useEffect(() => {
    let filtered = allFetchedEvents;

    if (selectedOrg) {
      filtered = filtered.filter(event => event.org === selectedOrg);
    }

    setCalendarEvents(filtered);
  }, [allFetchedEvents, selectedOrg]);

  useEffect(() => {
    console.log('Orgs: ', orgOptions);
    console.log('Selected Org: ', selectedOrg);
    console.log('Calendar Events: ', calendarEvents);
  }, [orgOptions, selectedOrg, calendarEvents]);

  return (
    <>
      <form id="calendar-filter-form" style={{
        display: 'flex',
        gap: '2em',
        alignItems: 'center',
        margin: '1em 0 2em 0',
        flexWrap: 'wrap'
      }}>
        <label>
          <span style={{fontWeight: 500, fontSize: '1em', marginRight: '0.5em'}}>
            Organization:
          </span>
          <select id="filter-org" style={{
            padding: '0.4em 1em',
            border: '1.5px solid #dee2e6',
            borderRadius: '6px',
            minWidth: '120px'
          }}>
            <option value="">Any</option>
            {orgOptions.map((org, index) => (
              <option key={index} value={org}>{org}</option>
            ))}
          </select>
        </label>
      </form>
      <div style={{margin: '2em 0'}}>
        <div style={{textAlign: 'center', marginBottom: '1em'}}>
          <button id="prev-cal-month" style={{
            marginRight: '1em',
            padding: '0.5em 0.75em',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>&#8592;</button>
          <input
            type="text"
            id="current-cal-month"
            defaultValue="August 2025"
            style={{
              fontWeight: 'bold',
              fontSize: '1.2em',
              textAlign: 'center',
              border: '2px solid #dee2e6',
              borderRadius: '6px',
              padding: '0.5em 1em',
              margin: '0 0.5em',
              minWidth: '200px',
              background: '#f8f9fa'
            }}
            placeholder="Month YYYY"
          />
          <button id="next-cal-month" style={{
            marginLeft: '1em',
            padding: '0.5em 0.75em',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>&#8594;</button>
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          maxWidth: '600px',
          margin: '0 auto',
          background: '#ddd',
          border: '1px solid #ddd'
        }}>
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{
              background: '#f0f0f0',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {day}
            </div>
          ))}
          <div id="calendar-grid" style={{gridColumn: '1 / -1', display: 'contents'}}>
            {/* Days will be inserted here by JavaScript */}
            {calendarEvents.map((event, index) => (
              <div
                key={index}
                style={{
                  background: '#f9f9f9',
                  minHeight: '60px',
                  border: '1px solid #eee',
                  padding: '10px',
                }}
              >
                <div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Popover */}
      <div id="event-details-overlay" style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 998
      }}></div>
      <div id="event-details-popover" style={{
        display: 'none',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        background: '#fff',
        border: 'none',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: 0,
        maxWidth: '850px',
        maxHeight: '85vh',
        overflowY: 'auto',
        zIndex: 999,
        borderRadius: '16px',
        minWidth: '600px'
      }}>
        {/* ... rest of the event details popover structure ... */}
      </div>
    </>
  )
}
