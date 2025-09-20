import {Metadata} from "next";

import {EventCalendar} from "@/components/Calendar";
import {fetchEventsForMonth} from "@/lib/api/fetchEventsForMonth";

export const metadata: Metadata = {
  title: "Event Calendar",
}

const Calendar = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const params = await searchParams;

  const now = new Date();
  const year = Number(params?.year || now.getFullYear());
  const month = Number(params?.month || now.getMonth());

  const events = await fetchEventsForMonth({ year, month });

  return (
    <main>
      <h1>Event Calendar</h1>
      <EventCalendar monthEvents={events} date={{ year, month }} />
    </main>
  )
}

export default Calendar;
