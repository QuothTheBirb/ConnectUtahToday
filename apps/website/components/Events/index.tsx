"use client";

import type { CalendarEvent } from "@connect-utah-today/api/types";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EventsMonthSelect } from "@/components/Events/MonthSelect";
import { EventsViews } from "@/components/Events/Views";
import { FiltersForm } from "@/components/FiltersForm";
import { CityFilter } from "@/components/FiltersForm/Filters/CitySelect";
import { DateRangeFilter } from "@/components/FiltersForm/Filters/DateRange";
import { OrganizationFilter } from "@/components/FiltersForm/Filters/OrgSelect";
import FormInput from "@/components/form/inputs/FormInput";
import { FormSelect } from "@/components/form/inputs/FormSelect";

import styles from "./Events.module.scss";

export const Events = ({
	monthEvents,
	date: { year, month },
}: {
	monthEvents: CalendarEvent[];
	date: {
		year: number;
		month: number;
	};
}) => {
	const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
	const [orgFilterType, setOrgFilterType] = useState<"include" | "exclude">(
		"include",
	);
	const [locationSearch, setLocationSearch] = useState("");
	const [upcomingOnly, setUpcomingOnly] = useState(true);
	const [dateRange, setDateRange] = useState({
		start: "",
		end: "",
	});
	const [appliedFilters, setAppliedFilters] = useState<{
		orgs: string[];
		orgFilterType: "include" | "exclude";
		location: string;
		upcomingOnly: boolean;
		dateRange: { start: string; end: string };
	}>({
		orgs: [],
		orgFilterType: "include",
		location: "",
		upcomingOnly: true,
		dateRange: { start: "", end: "" },
	});

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

		const citySet = new Set<string>();

		monthEvents.forEach((event) => {
			if (event.location?.city) {
				citySet.add(event.location.city.trim());
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
					citySet.add(match[1].trim());
				}
			}
		});

		return Array.from(citySet)
			.map((city) => ({
				value: city,
				label: city,
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [monthEvents]);

	const events = useMemo(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);

		return monthEvents.filter((event) => {
			// Filter by applied org
			let matchesOrg = true;
			if (appliedFilters.orgs.length > 0) {
				const hasOrg =
					!!event.organization?.slug &&
					appliedFilters.orgs.includes(event.organization.slug);
				matchesOrg =
					appliedFilters.orgFilterType === "include"
						? hasOrg
						: !hasOrg;
			}

			// Filter by location
			const matchesLocation =
				!appliedFilters.location ||
				(!!event.location?.city &&
					event.location.city.trim() === appliedFilters.location) ||
				(!!event.location?.venue &&
					event.location.venue
						.toLowerCase()
						.includes(appliedFilters.location.toLowerCase())) ||
				(!!event.location?.address &&
					event.location.address
						.toLowerCase()
						.includes(appliedFilters.location.toLowerCase()));

			// Filter by applied date range
			const start = appliedFilters.dateRange.start
				? new Date(appliedFilters.dateRange.start)
				: undefined;
			const end = appliedFilters.dateRange.end
				? new Date(appliedFilters.dateRange.end)
				: undefined;
			if (end) end.setHours(23, 59, 59, 999);

			const eventDate = new Date(event.date);
			const withinDateRange =
				(!start || eventDate >= start) && (!end || eventDate <= end);

			return matchesOrg && matchesLocation && withinDateRange;
		});
	}, [monthEvents, appliedFilters]);

	useEffect(() => {
		console.log(monthEvents);
	}, [monthEvents]);

	const applyFilters = useCallback(() => {
		setAppliedFilters({
			orgs: selectedOrgs,
			orgFilterType: orgFilterType,
			location: locationSearch,
			upcomingOnly: upcomingOnly,
			dateRange: dateRange,
		});
	}, [selectedOrgs, orgFilterType, locationSearch, upcomingOnly, dateRange]);

	const clearFilters = useCallback(() => {
		setSelectedOrgs([]);
		setOrgFilterType("include");
		setLocationSearch("");
		setUpcomingOnly(true);
		setDateRange({ start: "", end: "" });
		setAppliedFilters({
			orgs: [],
			orgFilterType: "include",
			location: "",
			upcomingOnly: true,
			dateRange: { start: "", end: "" },
		});
	}, []);

	const isClearable = useMemo(() => {
		return (
			selectedOrgs.length > 0 ||
			orgFilterType !== "include" ||
			locationSearch !== "" ||
			!upcomingOnly ||
			dateRange.start !== "" ||
			dateRange.end !== "" ||
			appliedFilters.orgs.length > 0 ||
			appliedFilters.orgFilterType !== "include" ||
			appliedFilters.location !== "" ||
			!appliedFilters.upcomingOnly ||
			appliedFilters.dateRange.start !== "" ||
			appliedFilters.dateRange.end !== ""
		);
	}, [
		appliedFilters,
		dateRange,
		selectedOrgs,
		orgFilterType,
		locationSearch,
		upcomingOnly,
	]);

	return (
		<div className={styles.events}>
			<EventsMonthSelect date={{ year, month }} />
			<FiltersForm
				applyFilters={applyFilters}
				clearFilters={clearFilters}
				showClearButton={isClearable}
			>
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
						onChange={(
							val: any, // TODO: No.
						) => setOrgFilterType(val?.value || "include")}
					/>
				</div>
				<CityFilter
					cityOptions={cityOptions}
					selectedCity={locationSearch}
					setSelectedCity={setLocationSearch}
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
