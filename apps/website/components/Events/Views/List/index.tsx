"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CalendarEvent, CalendarEvents } from "@connect-utah-today/api/types";
import { EventInfo } from "@/components/Events/EventInfo";
import { Popup } from "@/components/Popup";

import styles from "./List.module.scss";

const isHtmlContent = (text: string): boolean => /<[a-z][\s\S]*>/i.test(text);

const stripMarkdown = (text: string): string =>
	text
		.replace(/<[^>]+>/g, " ") // strip HTML tags first
		.replace(/\*\*(.+?)\*\*/g, "$1")
		.replace(/\*(.+?)\*/g, "$1")
		.replace(/__(.+?)__/g, "$1")
		.replace(/_(.+?)_/g, "$1")
		.replace(/\[(.+?)\]\(.+?\)/g, "$1")
		.replace(/^#+\s*/gm, "")
		.replace(/`(.+?)`/g, "$1")
		.replace(/~~(.+?)~~/g, "$1")
		.replace(/\n+/g, " ")
		.trim();

const EventPopup = ({
	event,
	onClose,
}: {
	event: CalendarEvent;
	onClose: () => void;
}) => {
	const image = event.image;
	const organizationName = event.organization?.name;

	return (
		<Popup isOpen onClose={onClose} title="Event">
			<div className={styles.popupContent}>
				{image && (
					<div className={styles.popupImageContainer}>
						<Image
							src={image}
							alt={event.title ?? "Event image"}
							width={0}
							height={0}
							sizes="100vw"
							className={styles.popupImage}
							onError={(e) =>
								(e.currentTarget.src =
									"/assets/placeholder.jpg")
							}
						/>
					</div>
				)}
				<div className={styles.popupBody}>
					<hgroup>
						{organizationName && (
							<p className={styles.eventOrg}>
								{organizationName}
							</p>
						)}
						{event.title && (
							<h2 className={styles.eventTitle}>{event.title}</h2>
						)}
					</hgroup>
					<EventInfo event={event} className={styles.eventInfo} />
					{event.description && (
						<div className={styles.popupDescription}>
							{event.source === "googleCalendar" &&
							isHtmlContent(event.description) ? (
								<div
									dangerouslySetInnerHTML={{
										__html: event.description,
									}}
								/>
							) : (
								<ReactMarkdown>
									{event.description}
								</ReactMarkdown>
							)}
						</div>
					)}
					{event.url && (
						<div className={styles.popupActions}>
							<a
								href={event.url}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.viewDetailsButton}
							>
								<span>View Details</span>{" "}
								<span className={styles.arrow}>→</span>
							</a>
						</div>
					)}
				</div>
			</div>
		</Popup>
	);
};

const EventItem = ({
	event,
	onClick,
}: {
	event: CalendarEvent;
	onClick: () => void;
}) => {
	const image = event.image;
	const organizationName = event.organization?.name;

	return (
		<li
			className={styles.eventItem}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && onClick()}
		>
			{image && (
				<div className={styles.eventImageContainer}>
					<Image
						src={image}
						alt={event.title ?? "Event image"}
						width={0}
						height={0}
						sizes="200px"
						className={styles.eventImage}
						onError={(e) =>
							(e.currentTarget.src = "/assets/placeholder.jpg")
						}
					/>
				</div>
			)}
			<div className={styles.eventDetails}>
				<hgroup>
					{organizationName && (
						<p className={styles.eventOrg}>{organizationName}</p>
					)}
					<h3 className={styles.eventTitle}>{event.title}</h3>
				</hgroup>
				<EventInfo event={event} />
			</div>
		</li>
	);
};

export const EventList = ({
	events,
	upcomingOnly = false,
}: {
	events: CalendarEvents;
	date: { year: number; month: number };
	upcomingOnly?: boolean;
}) => {
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);

	const filteredEvents = useMemo(() => {
		if (!upcomingOnly) return events;

		const now = new Date();
		now.setHours(0, 0, 0, 0);

		return events.filter((event) => {
			const eventDate = new Date(event.date);
			return eventDate >= now;
		});
	}, [events, upcomingOnly]);

	return (
		<>
			<ul className={styles.eventFeed}>
				{filteredEvents.map((event, index) => (
					<EventItem
						key={`${event.url}-${index}`}
						event={event}
						onClick={() => setSelectedEvent(event)}
					/>
				))}
			</ul>
			{selectedEvent && (
				<EventPopup
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</>
	);
};
