"use client";

import {useCallback, useMemo, useState} from "react";

import {CalendarEvent} from "@cut/api/types";
import {EventsDisclaimer} from "@/components/Calendar/Disclaimer";
import {EventDetailsPopover} from "@/components/Calendar/EventDetailsPopover";
import {EventsFilter} from "@/components/Calendar/EventsFilter";
import {Calendar} from "@/components/Calendar/CalendarView";

export const EventCalendar = ({
  monthEvents,
  date: {
    year,
    month
  }
}: {
  monthEvents: CalendarEvent[];
  date: {
    year: number;
    month: number;
  }
}) => {
  const [eventDetails, setEventDetails] = useState<{events: CalendarEvent[]; date: Date} | null>(null);

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
    <div>
      <EventsFilter
        orgOptions={orgOptions}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
        dateRange={dateRange}
        setDateRange={setDateRange}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />
      <EventsDisclaimer />
      <EventDetailsPopover
        eventDetails={eventDetails}
        setEventDetails={setEventDetails}
      />
      <Calendar
        events={events}
        date={{
          year,
          month
        }}
        onDayClick={(dayEvents, date) => {
          setEventDetails({events: dayEvents, date});
        }}
      />
    </div>
  )
}
