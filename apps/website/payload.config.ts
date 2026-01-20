import sharp from 'sharp'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import {buildConfig} from 'payload'
import {postgresAdapter} from "@payloadcms/db-postgres";
import path from 'path';
import {fileURLToPath} from "url";
import {Users} from "@/payload/collections/Users";
import {Organizations} from "@/payload/collections/Organizations";
import {Opportunities} from "@/payload/collections/Opportunities";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Organizations, Opportunities],
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
  }
});
