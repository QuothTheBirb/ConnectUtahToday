import React from 'react'
import {Metadata} from "next";

import {EventCalendar} from "@/components/EventCalendar/eventCalendar";

export const metadata: Metadata = {
  title: "Event Calendar",
}

const Calendar = () => {
   return (
    <main>
      <h1>Event Calendar</h1>
      <EventCalendar />
    </main>
  )
}

export default Calendar;
