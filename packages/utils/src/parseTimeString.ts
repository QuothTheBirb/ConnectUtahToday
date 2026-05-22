export const parseTimeString = (timeString: string): Date | null => {
	const parsedTime = new Date(timeString);

	return isNaN(parsedTime.getTime()) ? null : parsedTime;
};
