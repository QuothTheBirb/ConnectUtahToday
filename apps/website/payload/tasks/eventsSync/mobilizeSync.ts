import type {PaginatedDocs, TaskConfig} from 'payload'
import {Event} from "@/payload-types";
import {fetchMobilizeEvents} from "@/lib/api/fetchMobilizeEvents";

export const mobilizeSync: TaskConfig<'mobilizeSync'> = {
  slug: 'mobilizeSync',
  label: 'Sync events from Mobilize',
  onSuccess: () => {
    console.log('The task succeeded :)')
  },
  onFail: () => {
    console.log('The task failed :(')
  },
  // retries: 3,
  handler: async ({ req }) => {
    console.log('Syncing Mobilize events…');

    const settings = await req.payload.findGlobal({
      slug: 'event-settings',
    });

    if (!settings.mobilize?.enableMobilize) {
      console.log('Mobilize integration disabled, skipping…');

      return {
        output: {
          success: true,
          itemsSynced: 0,
          message: 'Mobilize integration disabled, skipping…'
        }
      }
    }

    // Calculate date range (+/- 6 months)
    const dateRange = 3;
    const now = new Date();
    const timeMin = new Date(now);
    timeMin.setMonth(now.getMonth() - dateRange);
    const timeMax = new Date(now);
    timeMax.setMonth(now.getMonth() + dateRange);

    // Event filters
    const state = settings.mobilize.enableStateFilter ? settings.mobilize.stateFilter?.state : undefined;
    const orgFilter = settings.mobilize.enableOrganizationFilter && settings.mobilize.organizationFilter?.type && settings.mobilize.organizationFilter?.list
      ? {
          type: settings.mobilize.organizationFilter.type,
          list: settings.mobilize.organizationFilter.list
        }
      : undefined;

    // Fetch events from Mobilize
    const mobilizeEvents = await fetchMobilizeEvents({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      filters: {
        state: state,
        organizations: orgFilter
      }
    });

    // let mobilizeEvents = [];
    // try {
    //   mobilizeEvents = await
    //
    //   console.log(mobilizeEvents)
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.error('Failed to fetch events from Mobilize:', error.message);
    //
    //     throw new Error(`Failed to fetch events from Mobilize: ${error.message ?? 'Unknown error'}`);
    //   }
    //
    //   throw error;
    // }

    let itemsSynced = 0;
    const syncedMobilizeIds: number[] = [];

    console.log('Fetched', mobilizeEvents.length, 'events from Mobilize')

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const event of mobilizeEvents) {
      if (!event || !event.mobilizeId) continue;

      const { mobilizeId } = event;

      syncedMobilizeIds.push(mobilizeId);

      // Map the API event structure to the Payload event collection structure
      const payloadData = {
        title: event.title,
        description: event.description || '',
        url: event.url,
        date: event.date,
        endDate: event.endDate,
        eventType: event.eventType,
        source: event.source,
        mobilize: {
          eventId: event.mobilizeId,
          image: event.image,
          organization: {
            id: event.organization.id,
            name: event.organization.name,
            slug: event.organization.slug,
            url: event.organization.url,
            state: event.organization.state,
          }
        }
      };

      // Check if event exists
      const existingEventsInDb: PaginatedDocs<Event> = await req.payload.find({
        collection: 'events',
        where: {
          source: { equals: 'mobilize' },
          'mobilize.eventId': { equals: mobilizeId },
        },
        limit: 1,
      });
      const eventDb = existingEventsInDb.docs.length ? existingEventsInDb.docs[0] : undefined;

      try {
        if (eventDb) {
          console.log(`Updating existing mobilize event: ${mobilizeId}`);

          await req.payload.update({
            collection: 'events',
            id: eventDb.id,
            data: payloadData,
          })
        } else {
          console.log(`Creating new mobilize event: ${mobilizeId}`);

          await req.payload.create({
            collection: 'events',
            data: payloadData,
          });
        }

        itemsSynced++;

        // Small delay between processing events to reduce CPU usage and database load
        // Extra slow until I can test performance so that the CPU usage doesn't spike with each sync
        // await sleep(50);
        await sleep(500);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to sync event ${mobilizeId}:`, error.message);
        }
      }
    }

    // Remove events that no longer exist or are now filtered out
    try {
      const allMobilizeEventsInDb = await req.payload.find({
        collection: 'events',
        where: {
          source: { equals: 'mobilize' }
        },
        limit: 0
      })

      for (const dbEvent of allMobilizeEventsInDb.docs) {
        const eventId = dbEvent.mobilize?.eventId;

        if (eventId && !syncedMobilizeIds.includes(eventId)) {
          console.log(`Deleting outdated mobilize event: ${eventId}`);

          await req.payload.delete({
            collection: 'events',
            id: dbEvent.id,
          })
        }
      }
    } catch (error) {
      console.error('Failed to cleanup stale events:', error)

      return {
        output: {
          success: false,
          itemsSynced: itemsSynced,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    console.log('Mobilize events synced successfully.');

    return {
      output: {
        success: true,
        itemsSynced: itemsSynced,
        message: 'Mobilize events synced successfully.'
      }
    }
  },
}
