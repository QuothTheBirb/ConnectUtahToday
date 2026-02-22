import {CollectionConfig} from 'payload'
import {adminOnly} from '@/payload/access/adminOnly'
import {calculateExpiry} from '@/payload/collections/OrganizationInvites/hooks/calculateExpiry'
import {generateCode} from "@/lib/generateCode";

export const OrganizationInvites: CollectionConfig = {
  slug: 'organization-invites',
  access: {
    read: adminOnly,
    create: adminOnly,
    update: () => false,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'notes', 'status', 'expirationDate', 'createdBy'],
  },
  hooks: {
    beforeChange: [calculateExpiry],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      unique: true,
      required: true,
      defaultValue: () => generateCode(12),
      admin: {
        description: 'The secure code used for the invite link.',
        hidden: true,
      }
    },
    {
      name: 'inviteLink',
      type: 'ui',
      admin: {
        components: {
          Field: '@/payload/collections/OrganizationInvites/components/InviteLink#InviteLinkField',
        },
      },
    },
    {
      type: 'group',
      fields: [
        {
          name: 'organizationTokens',
          type: 'number',
          label: 'Organization Tokens',
          defaultValue: 1,
          min: 1,
          max: 10,
          required: true,
          admin: {
            description: 'The total number of organizations that the recipient can create after the invite is accepted. Max 10.',
          }
        },
        {
          name: 'expiresIn',
          label: 'Expires',
          type: 'select',
          defaultValue: '2weeks',
          options: [
            {label: 'In 1 day', value: '1day'},
            {label: 'In 3 days', value: '3days'},
            {label: 'In 1 week', value: '1week'},
            {label: 'In 2 weeks', value: '2weeks'},
            {label: 'In 1 month', value: '1month'},
            {label: 'On Date', value: 'date'},
          ],
          required: true,
        },
        {
          name: 'expirationDate',
          label: 'Expiration Date',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            condition: (data) => data?.expiresIn === 'date' || data?.createdAt,
          },
        },
      ]
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {label: 'Pending', value: 'pending'},
        {label: 'Accepted', value: 'accepted'},
        {label: 'Expired', value: 'expired'},
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'usedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      }
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: '(Optional) Internal notes for this invitation. These are only visible to site administrators.',
        position: 'sidebar',
      }
    },
  ],
}
