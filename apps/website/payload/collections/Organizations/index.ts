import {CollectionConfig, slugField} from "payload";
import {adminOnlyFieldAccess} from "@/payload/access/adminOnlyFieldAccess";
import {checkRole} from "@/payload/access/utilities";
import {adminOrOrganizer} from "@/payload/collections/Organizations/access/adminOrOrganizer";

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  access: {
    create: adminOrOrganizer,
    delete: adminOrOrganizer,
    read: adminOrOrganizer,
    update: adminOrOrganizer,
  },
  admin: {
    defaultColumns: ["name", "slug", "organizer", "createdAt"],
    useAsTitle: "name",
  },
  defaultSort: ['name'],
  hooks: {
    // afterChange: [completeInvite],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Organization Details',
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
              required: true,
              // TODO: Add validation to input
            },
            {
              name: 'organizers',
              label: 'Organizers',
              type: "relationship",
              hasMany: true,
              relationTo: 'users',
              defaultValue: ({ user }) => {
                if (checkRole(['organizer'], user)) return [{
                  id: user?.id,
                }]
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
        },
        {
          label: 'Organization Page',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'organization-assets'
            },
            // {
            //   name: 'shortDescription',
            //   label: 'Short Description',
            //   type: 'richText',
            // },
            {
              name: 'description',
              label: 'Page Content',
              type: 'richText',
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
          ]
        }
      ]
    },
  ]
}
