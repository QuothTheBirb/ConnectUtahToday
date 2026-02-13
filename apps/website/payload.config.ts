import sharp from 'sharp'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import {buildConfig} from 'payload'
import {postgresAdapter} from "@payloadcms/db-postgres";
import path from 'path';
import {fileURLToPath} from "url";
import {Users} from "@/payload/collections/Users";
import {Organizations} from "@/payload/collections/Organizations";
import {Opportunities} from "@/payload/collections/Opportunities";
import {EventSettings} from "@/payload/globals/EventSettings";
import {Events} from "@/payload/collections/Events";
import {EventAssets} from "@/payload/collections/EventAssets";
import {mobilizeSync} from "@/payload/tasks/eventsSync/mobilizeSync";
import {googleCalendarSync} from "@/payload/tasks/eventsSync/googleCalendarSync";
import {syncEvents} from "@/payload/workflows/syncEvents";
import {OrganizationAssets} from "@/payload/collections/OrganizationAssets";
import {OrganizationInvites} from "@/payload/collections/OrganizationInvites";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Organizations, Opportunities, Events, EventAssets, OrganizationAssets, OrganizationInvites],
  globals: [EventSettings],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL
    },
    idType: 'uuid',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  sharp,
  routes: {
    admin: '/dashboard',
    api: '/payload-api'
  },
  jobs: {
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {};
      }

      defaultJobsCollection.admin.hidden = false;

      defaultJobsCollection.hooks = {
        ...defaultJobsCollection.hooks,
      }

      return defaultJobsCollection;
    },
    enableConcurrencyControl: true,
    autoRun: [
      {
        cron: "* * * * *",
        queue: 'sync-events',
      }
    ],
    processingOrder: {
      default: 'createdAt',
      queues: {
        'sync-events': '-createdAt',
      }
    },
    workflows: [syncEvents],
    tasks: [mobilizeSync, googleCalendarSync]
  }
});
