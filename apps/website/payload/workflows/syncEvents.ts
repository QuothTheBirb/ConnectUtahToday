import {WorkflowConfig} from "payload";

export const syncEvents: WorkflowConfig<'syncEvents'> = {
  slug: "syncEvents",
  label: 'Synchronize with all event sources and update calendar events.',
  schedule: [
    {
      cron: '* * 0/4 * * *', // Every 4 hours, or 6 times a day
      queue: 'sync-events',
    },
  ],
  concurrency: {
    key: ({input, queue}) => `sync-events`,
    exclusive: true,
    supersedes: true
  },
  handler: async ({ job, tasks }) => {
    await tasks.mobilizeSync('sync-mobilize-events', {});
    await tasks.googleCalendarSync('sync-google-calendar-events', {});
  }
}
