import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "invite_code";
  ALTER TABLE "users" DROP COLUMN "organization_name";
  ALTER TABLE "users" DROP COLUMN "organization_description";
  ALTER TABLE "users" DROP COLUMN "organization_contact_methods";
  ALTER TABLE "users" DROP COLUMN "organization_contact_email";
  ALTER TABLE "users" DROP COLUMN "organization_contact_phone";
  ALTER TABLE "users" DROP COLUMN "organization_contact_page";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "invite_code" varchar;
  ALTER TABLE "users" ADD COLUMN "organization_name" varchar;
  ALTER TABLE "users" ADD COLUMN "organization_description" varchar;
  ALTER TABLE "users" ADD COLUMN "organization_contact_methods" jsonb;
  ALTER TABLE "users" ADD COLUMN "organization_contact_email" varchar;
  ALTER TABLE "users" ADD COLUMN "organization_contact_phone" varchar;
  ALTER TABLE "users" ADD COLUMN "organization_contact_page" varchar;`)
}
