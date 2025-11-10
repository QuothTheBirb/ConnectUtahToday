import sharp from 'sharp'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import {buildConfig} from 'payload'
import {postgresAdapter} from "@payloadcms/db-postgres";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL
    }
  }),
  sharp,
  routes: {
    admin: '/dashboard',
    api: '/payload-api'
  }
});
