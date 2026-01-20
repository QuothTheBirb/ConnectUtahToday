import {CollectionConfig, slugField} from "payload";
import {publicAccess} from "@/payload/access/publicAccess";
import {adminOrOrganizer} from "@/payload/collections/Organizations/access/adminOrOrganizer";
import {adminOnlyFieldAccess} from "@/payload/access/adminOnlyFieldAccess";
import {checkRole} from "@/payload/access/utilities";

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  access: {
    create: publicAccess,
    delete: adminOrOrganizer,
    read: adminOrOrganizer,
    update: adminOrOrganizer,
  },
  admin: {
    defaultColumns: ["name", "slug", "organizer", "createdAt"],
    useAsTitle: "name",
  },
  defaultSort: ['name'],
  fields: [
    {
      name: 'name',
      label: 'Organization Name',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'name',
    }),
    {
      name: 'url',
      label: 'Organization Link',
      type: 'text',
    },
    {
      name: 'opportunities',
      label: 'Volunteering Opportunities',
      type: "relationship",
      relationTo: 'opportunities',
      hasMany: true,
      admin: {
        sortOptions: 'name'
      }
    },
    {
      name: 'organizer',
      label: 'Organizer',
      type: "relationship",
      relationTo: 'users',
      defaultValue: ({ user }) => {
        if (checkRole(['organizer'], user)) return {
          id: user?.id,
        }
      },
      filterOptions:  {
        roles: {
          contains: 'organizer'
        }
      },
      required: true,
      access: {
        update: adminOnlyFieldAccess,
      }
    },
  ]
}
