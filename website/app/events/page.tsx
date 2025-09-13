import type {Metadata} from 'next';

import UpcomingEvents from "@/components/UpcomingEvents";

export const metadata: Metadata = {
  title: 'Upcoming Events'
}

const Events = () => {

  return (
    <main>
      <h1>Upcoming Events</h1>
      <UpcomingEvents />
    </main>
  )
}

export default Events;
