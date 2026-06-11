import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" ADD COLUMN "local_is_poster_upload" boolean;
  ALTER TABLE "events" ADD COLUMN "local_poster_image_id" uuid;
  ALTER TABLE "events" ADD CONSTRAINT "events_local_poster_image_id_event_assets_id_fk" FOREIGN KEY ("local_poster_image_id") REFERENCES "public"."event_assets"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "events_local_local_poster_image_idx" ON "events" USING btree ("local_poster_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP CONSTRAINT "events_local_poster_image_id_event_assets_id_fk";
  
  DROP INDEX "events_local_local_poster_image_idx";
  ALTER TABLE "events" DROP COLUMN "local_is_poster_upload";
  ALTER TABLE "events" DROP COLUMN "local_poster_image_id";`)
}
