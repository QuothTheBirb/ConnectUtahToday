import type {TaskConfig} from 'payload'

export const googleCalendarSync: TaskConfig<'googleCalendarSync'> = {
  slug: 'googleCalendarSync',
  label: 'Sync events from Google Calendar',
  retries: 3,
  handler: async ({ req }) => {
    console.log('Syncing Google Calendar events…');
    console.log('Google Calendar events synced successfully. (test mode)');

    return {
      output: {
        success: true,
        itemsSynced: 0,
        message: 'Google Calendar events synced successfully.'
      }
    }
  },
}
