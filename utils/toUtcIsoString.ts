/**
 * Converts a standard date representation (string or Date object) into a standardized ISO 8601 UTC string.
 *
 * @param input The date value to convert. It can be an ISO 8601 string, `YYYY-MM-DD` string, or a `Date` object.
 * @returns An ISO 8601 UTC string, or undefined if the input is invalid.
 */
export const toUtcIsoString = (input: string | Date | null | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }

  // Handle 'YYYY-MM-DD' date strings
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return `${input}T00:00:00.000Z`;
  }

  // For other strings or Date objects
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

type GoogleCalendarDateInput = { date?: string | null; dateTime?: string | null };

/**
 * Converts a date object from the Google Calendar API into a standardized ISO 8601 UTC string.
 *
 * @param input The date object from the Google Calendar API.
 * @returns An ISO 8601 UTC string, or undefined if the input is invalid.
 */
export const googleCalendarDateToUtcIso = (input: GoogleCalendarDateInput | null | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }

  const dateValue = input.dateTime || input.date;

  return toUtcIsoString(dateValue);
};

/**
 * Converts a UNIX timestamp (seconds) from the Mobilize API into a standardized ISO 8601 UTC string.
 *
 * @param timestamp The UNIX timestamp in seconds from the Mobilize API.
 * @returns An ISO 8601 UTC string, or undefined if the input is null or undefined.
 */
export const mobilizeTimestampToUtcIso = (timestamp: number | null | undefined): string | undefined => {
  if (timestamp === null || timestamp === undefined) {
    return undefined;
  }

  // Mobilize uses UNIX timestamps in seconds, so multiply by 1000 for milliseconds.
  return new Date(timestamp * 1000).toISOString();
};
