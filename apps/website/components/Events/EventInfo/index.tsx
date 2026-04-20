import { Calendar1, Clock, MapPin, Megaphone } from "lucide-react";
import { CalendarEvent } from "@connect-utah-today/api/types";
import { eventDateString, eventTimeString } from "@connect-utah-today/utils/eventDateString";
import { eventLocationString } from "@/lib/eventLocationString";
import { sourceLabel } from "@/lib/eventSourceLabel";

import styles from "./EventInfo.module.scss";

export const EventInfo = ({
	event,
	className,
}: {
	event: CalendarEvent;
	className?: string;
}) => {
	const dateString = eventDateString(event.date, event.endDate);
	const timeString = eventTimeString(event.date, event.endDate);
	const location = eventLocationString(event.location);

	return (
		<div
			className={`${styles.eventInfo}${className ? ` ${className}` : ""}`}
		>
			{event.date && (
				<>
					<span className={styles.eventGridLabel}>
						<Calendar1 size={16} />
					</span>
					<span className={styles.eventGridValue}>{dateString}</span>
					<span className={styles.eventGridLabel}>
						<Clock size={16} />
					</span>
					<span className={styles.eventGridValue}>{timeString}</span>
				</>
			)}
			{location && (
				<>
					<span className={styles.eventGridLabel}>
						<MapPin size={16} />
					</span>
					<span className={styles.eventGridValue}>{location}</span>
				</>
			)}
			<span className={styles.eventGridLabel}>
				<Megaphone size={16} />
			</span>
			<span className={styles.eventGridValue}>{sourceLabel(event)}</span>
		</div>
	);
};
