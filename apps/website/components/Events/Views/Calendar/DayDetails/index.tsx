import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { CalendarEvent } from "@connect-utah-today/api/types";
import {
	eventDateString,
	eventTimeString,
} from "@connect-utah-today/utils/eventDateString";
import { EventInfo } from "@/components/Events/EventInfo";
import { Popup } from "@/components/Popup";

import styles from "./EventDetails.module.scss";

export const EventDetailsPopover = ({
	eventDetails,
	setEventDetails,
}: {
	eventDetails: {
		events: CalendarEvent[];
		date: Date;
	} | null;
	setEventDetails: Dispatch<
		SetStateAction<{
			events: CalendarEvent[];
			date: Date;
		} | null>
	>;
}) => {
	const onClose = () => {
		setEventDetails(null);
	};

	if (!eventDetails) return null;

	const { events, date } = eventDetails;
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return (
		<Popup isOpen={!!eventDetails} onClose={onClose} title="Events">
			<div className={styles.dateHeader}>
				<h3
					className={styles.dateHeaderTitle}
				>{`${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`}</h3>
				<p
					className={styles.dateHeaderSubtitle}
				>{`${events.length} event${events.length !== 1 ? "s" : ""} scheduled`}</p>
			</div>
			{events.map((event, index) => {
				const dateString = eventDateString(event.date, event.endDate);
				const timeString = eventTimeString(event.date, event.endDate);
				const description = event.description;
				const image = event.image;

				const organization = event.organization
					? event.organization
					: null;

				return (
					<div key={index}>
						{index > 0 && (
							<div className={styles.eventSeparator}></div>
						)}
						<div className={styles.eventCard}>
							<div className={styles.eventImageContainer}>
								{image && (
									<Image
										src={image}
										alt={event.title || "Event image"}
										width={0}
										height={0}
										sizes="100vw"
										className={styles.eventImage}
										onError={(event) =>
											(event.currentTarget.src =
												"/assets/placeholder.jpg")
										}
									/>
								)}
							</div>
							<div className={styles.eventDetails}>
								<hgroup>
									{organization?.name && (
										<p className={styles.eventOrg}>
											{organization?.name}
										</p>
									)}
									<h3 className={styles.eventTitle}>
										{event.title}
									</h3>
								</hgroup>
								<EventInfo
									event={event}
									className={styles.eventInfo}
								/>
								{description && (
									<div
										className={styles.eventDescription}
										dangerouslySetInnerHTML={{
											__html: description,
										}}
									></div>
								)}
								<div className={styles.eventActions}>
									{event.url && (
										<a
											href={event.url}
											target={"_blank"}
											rel={"noopener"}
											className={styles.viewDetailsButton}
										>
											<span>View Details</span>{" "}
											<span className={styles.arrow}>
												→
											</span>
										</a>
									)}
									{event.source === "mobilize" &&
										event.eventType && (
											<span
												className={styles.eventTypeTag}
											>
												{event.eventType}
											</span>
										)}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</Popup>
	);
};
