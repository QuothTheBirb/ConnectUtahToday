"use client";

import {useCallback, useEffect, useMemo, useState} from "react";

import {FiltersForm} from "@/components/FilterForm";
import {OrganizationFilter} from "@/components/FilterForm/Filters/OrgSelect";
import {DateRangeFilter} from "@/components/FilterForm/Filters/DateRange";
import {EventsViews} from "@/components/Events/Views";
import {EventsMonthSelect} from "@/components/Events/MonthSelect";
import styles from './Events.module.scss';
import {CalendarEvent} from "@connect-utah-today/api/types";

export const Events = ({
  monthEvents,
    date: {
      year,
      month
    },
}: {
  monthEvents: CalendarEvent[];
  date: {
    year: number;
    month: number;
  }
}) => {
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [ dateRange, setDateRange ] = useState({
    start: "",
    end: ""
  });
  const [ appliedFilters, setAppliedFilters ] = useState<{
    orgs: string[];
    dateRange: { start: string; end: string; };
  }>({
    orgs: [],
    dateRange: { start: "", end: "" }
  });

  const orgOptions = useMemo(() => {
    if (!monthEvents) return [];

    const orgMap = new Map<string, string>();

    monthEvents.forEach(event => {
      if (event.organization?.name && event.organization?.slug) {
        orgMap.set(event.organization.slug.trim(), event.organization.name.trim());
      }
    });

    return Array.from(orgMap.entries()).map(([slug, name]) => ({
      value: slug,
      label: name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [monthEvents]);

  const events = useMemo(() => {
    return monthEvents.filter((event) => {
      // Filter by applied org
      const matchesOrg = appliedFilters.orgs.length < 1 || (!!event.organization?.slug && appliedFilters.orgs.includes(event.organization.slug));

      // Filter by applied date range
      const start = appliedFilters.dateRange.start ? new Date(appliedFilters.dateRange.start) : undefined;
      const end = appliedFilters.dateRange.end ? new Date(appliedFilters.dateRange.end) : undefined;
      if (end) end.setHours(23, 59, 59, 999);

      const eventDate = new Date(event.date);
      const withinDateRange = (!start || eventDate >= start) && (!end || eventDate <= end);

      return matchesOrg && withinDateRange;
    })
  }, [monthEvents, appliedFilters]);

  useEffect(() => {
    console.log(monthEvents);
  }, [monthEvents]);

  const applyFilters = useCallback(() => {
    setAppliedFilters({
      orgs: selectedOrgs,
      dateRange: dateRange,
    });
  }, [selectedOrgs, dateRange]);

  const clearFilters = useCallback(() => {
    setSelectedOrgs([]);
    setDateRange({ start: "", end: "" });
    setAppliedFilters({
      orgs: [],
      dateRange: { start: "", end: "" },
    });
  }, []);

  const isClearable = useMemo(() => {
    return selectedOrgs.length > 0 ||
      dateRange.start !== "" || dateRange.end !== "" ||
      appliedFilters.orgs.length > 0 ||
      appliedFilters.dateRange.start !== "" ||
      appliedFilters.dateRange.end !== "";
  }, [appliedFilters, dateRange, selectedOrgs]);

  return (
    <div className={styles.events}>
      <FiltersForm
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        showClearButton={isClearable}
      >
        <OrganizationFilter
          orgOptions={orgOptions}
          selectedOrgs={selectedOrgs}
          setSelectedOrgs={setSelectedOrgs}
          selectMany={true}
        />
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </FiltersForm>
      <EventsMonthSelect date={{ year, month }} />
      <EventsViews events={events} date={{year, month}} />
    </div>
  )
}
