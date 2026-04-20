import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { migrations } from "@/migrations";
import { EventAssets } from "@/payload/collections/EventAssets";
import { Events } from "@/payload/collections/Events";
import { Opportunities } from "@/payload/collections/Opportunities";
import { OrganizationAssets } from "@/payload/collections/OrganizationAssets";
import { OrganizationInvites } from "@/payload/collections/OrganizationInvites";
import { Organizations } from "@/payload/collections/Organizations";
import { Users } from "@/payload/collections/Users";
import { EventSettings } from "@/payload/globals/EventSettings";
import { SiteSettings } from "@/payload/globals/SiteSettings";
import { googleCalendarSync } from "@/payload/tasks/eventsSync/googleCalendarSync";
import { mobilizeSync } from "@/payload/tasks/eventsSync/mobilizeSync";
import { scanPosterTask } from "@/payload/tasks/scanPoster";
import { manualSyncEvents } from "@/payload/workflows/manualSyncEvents";
import { syncEvents } from "@/payload/workflows/syncEvents";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname),
		},
		components: {
			providers: [
				"@/payload/components/SyncEventsNotifier#SyncEventsNotifier",
			],
		},
	},
	editor: lexicalEditor(),
	collections: [
		Users,
		Organizations,
		Opportunities,
		Events,
		EventAssets,
		OrganizationAssets,
		OrganizationInvites,
	],
	globals: [EventSettings, SiteSettings],
	secret: process.env.PAYLOAD_SECRET || "",
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URL,
		},
		idType: "uuid",
		migrationDir: "./migrations",
		prodMigrations: migrations,
	}),
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	sharp,
	onInit: async (payload) => {
		try {
			// Mark all "processing" sync-events and manual-sync-events jobs as "failed"
			// on server start since they were likely interrupted by a server restart.
			await payload.update({
				collection: "payload-jobs",
				where: {
					queue: { in: ["sync-events", "manual-sync-events"] },
					processing: { equals: true },
				},
				data: {
					processing: false,
					hasError: true,
					error: {
						message: "Job was interrupted by a server restart.",
					},
				},
				overrideAccess: true,
			});
		} catch (error) {
			payload.logger.error({
				err: error,
				msg: "Error clearing stuck sync-events jobs",
			});
		}
	},
	routes: {
		admin: "/dashboard",
		api: "/payload-api",
	},
	jobs: {
		jobsCollectionOverrides: ({ defaultJobsCollection }) => ({
			...defaultJobsCollection,
			admin: {
				...defaultJobsCollection.admin,
				hidden: ({ user }) => {
					return !user.roles.includes("admin");
				},
			},
		}),
		enableConcurrencyControl: true,
		autoRun: [
			{
				cron: "* * * * *",
				queue: "sync-events",
			},
			{
				cron: "* * * * *",
				queue: "manual-sync-events",
			},
			{
				cron: "* * * * *",
				queue: "posters",
			},
		],
		processingOrder: {
			default: "createdAt",
			queues: {
				"sync-events": "createdAt",
				"manual-sync-events": "createdAt",
				posters: "createdAt",
			},
		},
		workflows: [syncEvents, manualSyncEvents],
		tasks: [mobilizeSync, googleCalendarSync, scanPosterTask],
	},
});
