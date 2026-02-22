import type {CollectionConfig} from 'payload'
import {fileURLToPath} from 'url'
import path from 'path'
import {adminOnly} from "@/payload/access/adminOnly";
import {publicAccess} from "@/payload/access/publicAccess";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const OrganizationAssets: CollectionConfig = {
  slug: 'organization-assets',
  labels: {
    singular: 'Organization Assets',
    plural: 'Organization Assets',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicAccess,
    update: adminOnly,
  },
  admin: {
    hidden: ({user}) => {
      return !user.roles.includes('admin')
    }
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../../public/organization-assets'),
  },
}
