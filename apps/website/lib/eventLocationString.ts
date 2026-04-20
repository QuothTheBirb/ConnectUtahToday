import { CalendarEvent } from "@connect-utah-today/api/types";

const PRIVATE_LOCATION_PREFIXES = ["this event’s address is private."];

export const eventLocationString = (
	location: CalendarEvent["location"],
): string | null => {
	const parts = [
		location?.venue,
		location?.address,
		location?.city,
		location?.state,
	].filter(Boolean);

	if (parts.length === 0) return null;

	const result = parts.join(", ");

	if (
		PRIVATE_LOCATION_PREFIXES.some((p) =>
			result.toLowerCase().startsWith(p),
		)
	) {
		return "This event's address is private. Sign up for more details.";
	}

	return result;
};
