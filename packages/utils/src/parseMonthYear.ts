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

  const normalizedInput = input.toLowerCase().trim();

  const parseNamedMonth = (str: string): { year: number, month: number } | null => {
    const match = str.match(/^(\w+)\s+(\d{4})$/);
    if (!match || match[1] === undefined || match[2] === undefined) return null;

    const monthStr = match[1];
    const yearStr = match[2];

    const year = parseInt(yearStr);
    const month = monthNames.indexOf(monthStr) !== -1
      ? monthNames.indexOf(monthStr)
      : monthAbbrevs.indexOf(monthStr);

    return { year, month };
  };

  const parseNumericMonth = (str: string): { year: number, month: number } | null => {
    const match = str.match(/^(\d{1,2})\/(\d{4})$/);
    if (!match || match[1] === undefined || match[2] === undefined) return null;

    const monthStr = match[1];
    const yearStr = match[2];

    const month = parseInt(monthStr) - 1;
    const year = parseInt(yearStr);

    return { year, month: month >= 0 && month <= 11 ? month : -1 };
  };

  const parseReverseNumeric = (str: string): { year: number, month: number } | null => {
    const match = str.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (!match || match[1] === undefined || match[2] === undefined) return null;

    const yearStr = match[1];
    const monthStr = match[2];

    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;

    return { year, month: month >= 0 && month <= 11 ? month : -1 };
  };

  const result = parseNamedMonth(normalizedInput)
    || parseNumericMonth(normalizedInput)
    || parseReverseNumeric(normalizedInput)
    || { year: -1, month: -1 };

  return {
    month: result.month,
    year: result.year >= 1900 && result.year <= 2100 ? result.year : -1
  };
}
