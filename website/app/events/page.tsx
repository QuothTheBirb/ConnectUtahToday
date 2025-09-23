import type {Metadata} from 'next';

import {UpcomingEvents} from "@/components/UpcomingEvents";
import {fetchEventsForMonth} from "@/lib/api/fetchEventsForMonth";

export const metadata: Metadata = {
  title: 'Upcoming Events'
}

const Events = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const params = await searchParams;

  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) - 1 : now.getMonth();

  const events = await fetchEventsForMonth({ year, month });

  return (
    <main>
      <h1>Events</h1>
      <UpcomingEvents monthEvents={events} date={{ year, month }} />
    </main>
  )
}

export default Events;
