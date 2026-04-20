"use client";

import { CalendarDays, List } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarEvent } from "@connect-utah-today/api/types";
import { EventCalendar } from "@/components/Events/Views/Calendar";
import { EventList } from "@/components/Events/Views/List";

import styles from "./Views.module.scss";

export const EventsViews = ({
	events,
	date: { year, month },
	upcomingOnly = false,
}: {
	events: CalendarEvent[];
	date: {
		year: number;
		month: number;
	};
	upcomingOnly?: boolean;
}) => {
	const searchParams = useSearchParams();
	const view = searchParams.get("view") || "list";

	const params = new URLSearchParams(searchParams.toString());
	params.delete("view");
	const queryString = params.toString();

	return (
		<div className={styles.eventsView}>
			<div className={styles.viewTabs}>
				<Link
					href={`/events${queryString && `?${queryString}`}`}
					className={`${styles.viewTab}${view === "list" ? ` ${styles.active}` : ""}`}
					scroll={false}
				>
					<List size={16} />
					<span className={styles.viewTabText}>Events List</span>
					{/* Later change to "Upcoming Events" when filters are set to only show upcoming events */}
				</Link>
				<Link
					href={`/events?view=calendar${queryString && `&${queryString}`}`}
					className={`${styles.viewTab}${view === "calendar" ? ` ${styles.active}` : ""}`}
					scroll={false}
				>
					<CalendarDays size={16} />
					<span className={styles.viewTabText}>Event Calendar</span>
				</Link>
			</div>
			{view === "calendar" ? (
				<EventCalendar
					events={events}
					date={{ year, month }}
					upcomingOnly={upcomingOnly}
				/>
			) : (
				<EventList
					events={events}
					date={{ year, month }}
					upcomingOnly={upcomingOnly}
				/>
			)}
		</div>
	);
};
