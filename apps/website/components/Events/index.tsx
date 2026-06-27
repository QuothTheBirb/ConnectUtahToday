"use client";

import type { CalendarEvent } from "@connect-utah-today/api/types";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EventsMonthSelect } from "@/components/Events/MonthSelect";
import { EventsViews } from "@/components/Events/Views";
import { FiltersForm } from "@/components/FiltersForm";
import { CityFilter } from "@/components/FiltersForm/Filters/CitySelect";
import { DateRangeFilter } from "@/components/FiltersForm/Filters/DateRange";
import { EventTypeFilter } from "@/components/FiltersForm/Filters/EventType";
import { OrganizationFilter } from "@/components/FiltersForm/Filters/OrgSelect";
import FormInput from "@/components/form/inputs/FormInput";
import { FormSelect, SelectOption } from "@/components/form/inputs/FormSelect";
import { EventSetting } from "@/payload-types";

import styles from "./Events.module.scss";

export const Events = ({
	eventTypes,
	monthEvents,
	date: { year, month },
}: {
	eventTypes: NonNullable<EventSetting["eventTypes"]> | [];
	monthEvents: CalendarEvent[];
	date: {
		year: number;
		month: number;
	};
}) => {
	const [selectedOrgs, setSelectedOrgs] = useState<SelectOption[]>([]);
	const [orgFilterType, setOrgFilterType] = useState<"include" | "exclude">(
		"include",
	);
	const [selectedCities, setSelectedCities] = useState<SelectOption[]>([]);
	const [upcomingOnly, setUpcomingOnly] = useState(true);
	const [dateRange, setDateRange] = useState({
		start: "",
		end: "",
	});
	const [selectedEventTypes, setSelectedEventTypes] = useState<
		SelectOption[]
	>([]);

	const [appliedFilters, setAppliedFilters] = useState<{
		orgs: SelectOption[];
		orgFilterType: "include" | "exclude";
		cities: SelectOption[];
		upcomingOnly: boolean;
		dateRange: { start: string; end: string };
		eventTypes: SelectOption[];
	}>({
		orgs: [],
		orgFilterType: "include",
		cities: [],
		upcomingOnly: true,
		dateRange: { start: "", end: "" },
		eventTypes: [],
	});

	const isClearable = useMemo(() => {
		return (
			!upcomingOnly ||
			selectedOrgs.length > 0 ||
			selectedCities.length > 0 ||
			dateRange.start !== "" ||
			dateRange.end !== "" ||
			selectedEventTypes.length > 0 ||
			!appliedFilters.upcomingOnly ||
			appliedFilters.orgs.length > 0 ||
			appliedFilters.cities.length > 0 ||
			appliedFilters.dateRange.start !== "" ||
			appliedFilters.dateRange.end !== "" ||
			appliedFilters.eventTypes.length > 0
		);
	}, [
		selectedOrgs,
		dateRange,
		orgFilterType,
		selectedCities,
		upcomingOnly,
		selectedEventTypes,
		appliedFilters,
	]);

	const orgOptions = useMemo(() => {
		if (!monthEvents) return [];

		const orgMap = new Map<string, string>();

		monthEvents.forEach((event) => {
			if (event.organization?.name && event.organization?.slug) {
				orgMap.set(
					event.organization.slug.trim(),
					event.organization.name.trim(),
				);
			}
		});

		return Array.from(orgMap.entries())
			.map(([slug, name]) => ({
				value: slug,
				label: name,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [monthEvents]);

	const cityOptions = useMemo(() => {
		if (!monthEvents) return [];

		const cityMap = new Map<string, string>();

		monthEvents.forEach((event) => {
			if (event.location?.city) {
				cityMap.set(
					event.location.city.trim().toLowerCase(),
					event.location.city.trim(),
				);
			} else {
				const venue = event.location?.venue;
				const address = event.location?.address;
				const searchString = [venue, address]
					.filter(Boolean)
					.join(", ");

				// Try to extract city from venue/address for Google Calendar events
				// Heuristic: Matches "City, UT" or "City, UT 12345"
				// TODO: Use dynamic state instead of hardcoded one
				const match = searchString.match(/([^,]+),\s*UT/i);
				if (match && match[1]) {
					cityMap.set(match[1].trim(), match[1].trim().toLowerCase());
				}
			}
		});

		return Array.from(cityMap.entries())
			.map(([slug, name]) => ({
				value: slug,
				label: name,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [monthEvents]);

	const eventTypeOptions = useMemo(() => {
		if (eventTypes.length === 0) return [];

		const eventTypeMap = new Map<string, string>();

		monthEvents.forEach((event) => {
			if (event.eventType) {
				const eventType = eventTypes.find(
					(type) => type.id === event.eventType,
				);

				if (eventType?.id && eventType?.title) {
					eventTypeMap.set(
						eventType.id.trim(),
						eventType.title.trim(),
					);
				}
			}

			if (event.mobilizeEventType) {
				const matchingEventTypes = eventTypes.filter(
					(type) =>
						event.mobilizeEventType &&
						event.mobilizeEventType !== "OTHER" &&
						type.mobilizeEventTypes?.includes(
							event.mobilizeEventType,
						),
				);

				matchingEventTypes.forEach((eventType) => {
					if (eventType.id && eventType.title) {
						eventTypeMap.set(
							eventType.id.trim(),
							eventType.title.trim(),
						);
					}
				});
			}
		});

		return Array.from(eventTypeMap.entries())
			.map(([id, name]) => ({
				value: id,
				label: name,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [monthEvents]);

	const events = useMemo(() => {
		const hasOrgFilter = appliedFilters.orgs.length > 0;
		const hasLocationFilter = appliedFilters.cities.length > 0;
		const hasEventTypeFilter = appliedFilters.eventTypes.length > 0;

		const orgSlugsSet = new Set(
			appliedFilters.orgs.map((org) => org.value),
		);

		const citySet = new Set(
			appliedFilters.cities.map((city) => city.value),
		);

		const start = appliedFilters.dateRange.start
			? new Date(appliedFilters.dateRange.start)
			: undefined;
		const end = appliedFilters.dateRange.end
			? new Date(appliedFilters.dateRange.end)
			: undefined;
		if (end) end.setHours(23, 59, 59, 999);

		// Build a map of eventType ID -> mobilizeEventTypes for quick lookup
		const eventTypeIdSet = new Set(
			appliedFilters.eventTypes.map((et) => et.value),
		);
		const mobilizeTypeToEventTypeIds = new Map<string, boolean>();
		if (hasEventTypeFilter) {
			for (const fullEventType of eventTypes) {
				if (
					fullEventType.id &&
					eventTypeIdSet.has(fullEventType.id) &&
					fullEventType.mobilizeEventTypes
				) {
					for (const mobilizeType of fullEventType.mobilizeEventTypes) {
						mobilizeTypeToEventTypeIds.set(mobilizeType, true);
					}
				}
			}
		}

		return monthEvents.filter((event) => {
			// Filter by organization
			if (hasOrgFilter) {
				const eventOrgSlug = event.organization?.slug;
				const isInSet = !!(
					eventOrgSlug && orgSlugsSet.has(eventOrgSlug)
				);
				const matchesOrg =
					appliedFilters.orgFilterType === "include"
						? isInSet
						: !isInSet;

				if (!matchesOrg) return false;
			}

			// Filter by location
			if (hasLocationFilter) {
				const city = event.location?.city?.trim().toLowerCase();
				const matchesCity = !!(city && citySet.has(city));

				if (!matchesCity) return false;
			}

			// Filter by date range
			if (start || end) {
				const eventDate = new Date(event.date);
				if (start && eventDate < start) return false;
				if (end && eventDate > end) return false;
			}

			// Filter by event type
			if (hasEventTypeFilter) {
				const matchesLocalType =
					event.eventType && eventTypeIdSet.has(event.eventType);
				const matchesMobilizeType =
					event.mobilizeEventType &&
					event.mobilizeEventType !== "OTHER" &&
					mobilizeTypeToEventTypeIds.has(event.mobilizeEventType);
				if (!matchesLocalType && !matchesMobilizeType) return false;
			}

			return true;
		});
	}, [monthEvents, appliedFilters, eventTypes]);

	const applyFilters = useCallback(() => {
		setAppliedFilters({
			orgs: selectedOrgs,
			orgFilterType: orgFilterType,
			cities: selectedCities,
			upcomingOnly: upcomingOnly,
			dateRange: dateRange,
			eventTypes: selectedEventTypes,
		});
	}, [
		selectedOrgs,
		orgFilterType,
		selectedCities,
		upcomingOnly,
		dateRange,
		selectedEventTypes,
	]);
	const clearFilters = useCallback(() => {
		setSelectedOrgs([]);
		setOrgFilterType("include");
		setSelectedCities([]);
		setUpcomingOnly(true);
		setDateRange({ start: "", end: "" });
		setSelectedEventTypes([]);
		setAppliedFilters({
			orgs: [],
			orgFilterType: "include",
			cities: [],
			upcomingOnly: true,
			dateRange: { start: "", end: "" },
			eventTypes: [],
		});
	}, []);

	useEffect(() => {
		process.env.NODE_ENV === "development" &&
			console.log("Fetched Month Events: ", monthEvents);
	}, [monthEvents]);

	useEffect(() => {
		process.env.NODE_ENV === "development" &&
			console.log("Filtered Month Events: ", events);
	}, [events]);

	return (
		<div className={styles.events}>
			<EventsMonthSelect date={{ year, month }} />
			<FiltersForm
				applyFilters={applyFilters}
				clearFilters={clearFilters}
				showClearButton={isClearable}
			>
				<EventTypeFilter
					eventTypeOptions={eventTypeOptions}
					selectedEventTypes={selectedEventTypes}
					setSelectedEventTypes={setSelectedEventTypes}
				/>
				<div className={styles.orgFilter}>
					<OrganizationFilter
						orgOptions={orgOptions}
						selectedOrgs={selectedOrgs}
						setSelectedOrgs={setSelectedOrgs}
						selectMany={true}
						className={styles.orgSelect}
					/>
					<FormSelect
						label={"Organizations Filter Type"}
						id={"orgFilterType"}
						className={styles.orgTypeSelect}
						options={[
							{
								label: "Include Selected",
								value: "include",
							},
							{
								label: "Exclude Selected",
								value: "exclude",
							},
						]}
						value={{
							label:
								orgFilterType === "include"
									? "Include Selected"
									: "Exclude Selected",
							value: orgFilterType,
						}}
						onChange={(value: any) =>
							setOrgFilterType(value?.value || "include")
						}
					/>
				</div>
				<CityFilter
					cityOptions={cityOptions}
					selectedCities={selectedCities}
					setSelectedCities={setSelectedCities}
					className={styles.citySelect}
				/>
				<DateRangeFilter
					dateRange={dateRange}
					setDateRange={setDateRange}
					className={styles.dateRangeSelect}
				/>
				<FormInput
					type={"checkbox"}
					label={"Only show upcoming events"}
					id={"upcomingOnly"}
					checked={upcomingOnly}
					onChange={(e) => setUpcomingOnly(e.target.checked)}
					className={styles.upcomingCheckbox}
				/>
			</FiltersForm>
			<EventsViews
				events={events}
				date={{ year, month }}
				upcomingOnly={appliedFilters.upcomingOnly}
			/>
		</div>
	);
};
