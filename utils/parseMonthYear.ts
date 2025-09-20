/**
 * Parses a month/year string into a year and month object.
 *
 * @param input The month/year string to parse.
 * @returns The parsed month and year as an object with year and month properties.
 */
export const parseMonthYear = (input: string): { year: number, month: number } => {
  const monthNames = ["january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"];
  const monthAbbrevs = ["jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec"];

  input = input.toLowerCase().trim();

  let month = -1;
  let year = -1;

  const monthYearMatch = input.match(/^(\w+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const monthStr = monthYearMatch[1];
    year = parseInt(monthYearMatch[2]);
    month = monthNames.indexOf(monthStr);
    if (month === -1) {
      month = monthAbbrevs.indexOf(monthStr);
    }
  }

  const numericMatch = input.match(/^(\d{1,2})\/(\d{4})$/);
  if (numericMatch && month === -1) {
    month = parseInt(numericMatch[1]) - 1;
    year = parseInt(numericMatch[2]);
    if (month < 0 || month > 11) {
      month = -1;
    }
  }

  const reverseMatch = input.match(/^(\d{4})[-\/](\d{1,2})$/);
  if (reverseMatch && month === -1) {
    year = parseInt(reverseMatch[1]);
    month = parseInt(reverseMatch[2]) - 1;
    if (month < 0 || month > 11) {
      month = -1;
    }
  }

  if (year < 1900 || year > 2100) {
    year = -1;
  }

  return {month, year};
}
