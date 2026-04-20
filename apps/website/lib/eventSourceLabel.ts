import { CalendarEvent } from "@connect-utah-today/api/types";

export const sourceLabel = (event: CalendarEvent): string => {
	if (event.source === "googleCalendar")
		return event.organization?.name ?? "Google Calendar";
	if (event.source === "mobilize") return "Mobilize";
	return "Local";
};
