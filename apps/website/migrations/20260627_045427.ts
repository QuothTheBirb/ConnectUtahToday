import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_event_settings_event_types_mobilize_event_types" AS ENUM('CANVASS', 'PHONE_BANK', 'TEXT_BANK', 'MEETING', 'COMMUNITY', 'FUNDRAISER', 'MEET_GREET', 'HOUSE_PARTY', 'VOTER_REG', 'TRAINING', 'FRIEND_TO_FRIEND_OUTREACH', 'DEBATE_WATCH_PARTY', 'ADVOCACY_CALL', 'RALLY', 'TOWN_HALL', 'OFFICE_OPENING', 'BARNSTORM', 'SOLIDARITY_EVENT', 'COMMUNITY_CANVASS', 'SIGNATURE_GATHERING', 'CARPOOL', 'WORKSHOP', 'PETITION', 'AUTOMATED_PHONE_BANK', 'LETTER_WRITING', 'LITERATURE_DROP_OFF', 'VISIBILITY_EVENT');
  CREATE TABLE "event_settings_event_types_mobilize_event_types" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_event_settings_event_types_mobilize_event_types",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "event_settings_event_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  ALTER TABLE "events" ADD COLUMN "mobilize_event_type" varchar;
  ALTER TABLE "event_settings_event_types_mobilize_event_types" ADD CONSTRAINT "event_settings_event_types_mobilize_event_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event_settings_event_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_settings_event_types" ADD CONSTRAINT "event_settings_event_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "event_settings_event_types_mobilize_event_types_order_idx" ON "event_settings_event_types_mobilize_event_types" USING btree ("order");
  CREATE INDEX "event_settings_event_types_mobilize_event_types_parent_idx" ON "event_settings_event_types_mobilize_event_types" USING btree ("parent_id");
  CREATE INDEX "event_settings_event_types_order_idx" ON "event_settings_event_types" USING btree ("_order");
  CREATE INDEX "event_settings_event_types_parent_id_idx" ON "event_settings_event_types" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "event_settings_event_types_mobilize_event_types" CASCADE;
  DROP TABLE "event_settings_event_types" CASCADE;
  ALTER TABLE "events" DROP COLUMN "mobilize_event_type";
  DROP TYPE "public"."enum_event_settings_event_types_mobilize_event_types";`)
}
