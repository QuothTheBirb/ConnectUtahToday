import {CollectionConfig} from "payload";
import {publicAccess} from "@/payload/access/publicAccess";
import {
  activityVerifiedOrRequestedBySelf
} from "@/payload/collections/Opportunities/access/activityVerifiedOrRequestedBySelf";
import {activityRequestedBySelf} from "@/payload/collections/Opportunities/access/activityRequestedBySelf";
import {
  activityPendingOrRequestedBySelf
} from "@/payload/collections/Opportunities/access/activityPendingOrRequestedBySelf";
import {adminOnlyFieldAccess} from "@/payload/access/adminOnlyFieldAccess";
import {checkRole} from "@/payload/access/utilities";

export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  access: {
    create: publicAccess,
    delete: activityPendingOrRequestedBySelf,
    read: activityVerifiedOrRequestedBySelf,
    update: activityRequestedBySelf,
  },
  admin: {
    defaultColumns: ["name", "status"],
    useAsTitle: "name",
  },
  defaultSort: ['status', '-createdAt'],
  fields: [
    {
      name: 'name',
      label: 'Opportunity / Activity',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: `A brief description of the activity that is organization-agnostic, i.e. "Sharing resources and providing direct support to meet community needs".`
      }
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: ({ user }) => {
        if (checkRole(['admin'], user)) return "verified";

        return "pending";
      },
      options: [
        {
          label: "Pending Verification",
          value: 'pending',
        },
        {
          label: 'Verified',
          value: 'verified',
        }
      ],
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
    },
    {
      name: 'requestedBy',
      label: 'Requested By',
      type: "relationship",
      relationTo: 'users',
      defaultValue: ({ user }) => {
        if (!checkRole(['admin'], user)) return {
          id: user?.id
        };
      },
      filterOptions:  {
        roles: {
          contains: 'organizer'
        }
      },
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      admin: {
        condition: ({ user }) => checkRole(['admin'], user)
      }
    }
  ],
}
