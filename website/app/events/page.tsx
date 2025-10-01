import type {Metadata} from 'next';
import {fetchEventsForMonth} from "@/lib/api/fetchEventsForMonth";
import {Events} from "@/components/Events";
import {PageHeading} from "@/components/PageHeading";

export const metadata: Metadata = {
  title: 'Events'
}

const EventsPage = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const params = await searchParams;

  const now = new Date();
  const year = params.year ? Number(params.year) : now.getFullYear();
  const month = params.month ? Number(params.month) - 1 : now.getMonth();

  const events = await fetchEventsForMonth({ year, month });

  return (
    <main>
      <PageHeading heading={'h1'}>Events</PageHeading>
      <Events monthEvents={events} date={{ year, month }} />
    </main>
  )
}

export default EventsPage;
