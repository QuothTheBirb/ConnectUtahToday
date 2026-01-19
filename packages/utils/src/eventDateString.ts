export const eventDateString = (start: Date | string, end?: Date | string): string => {
  const startDate = new Date(start);
  const startDateString = startDate.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (!end) {
    return startDateString;
  }

  const endDate = new Date(end);
  const multipleEventDays = (endDate.valueOf() - startDate.valueOf()) >= 86400000; // If endDate exists and is more than 24 hours after startDate

  if (multipleEventDays) {
    const endDateString = endDate.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    return `${startDateString} – ${endDateString}`;
  }

  return startDateString;
};

export const eventTimeString = (start: Date | string, end?: Date | string): string => {
  // Mobilize events don't currently have a way to differentiate "All Day" events from those for set times. Implement later if that changes.
  // const isAllDayEvent = ...;

  const startDate = new Date(start);
  const startTimeString = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (!end) {
    return startTimeString;
  }

  const endDate = new Date(end);

  if (endDate.getTime() === startDate.getTime()) {
    return startTimeString;
  }

  const endTimeString = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const spansMultipleDays = startDate.toDateString() !== endDate.toDateString();

  if (spansMultipleDays && startTimeString.slice(-2) === endTimeString.slice(-2)) {
    return startTimeString;
  }

  return `${startTimeString} – ${endTimeString}`;
};
