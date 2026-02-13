import {CollectionConfig} from 'payload'
import {adminOnly} from '@/payload/access/adminOnly'
import crypto from 'crypto'
import {calculateExpiry} from '@/payload/collections/OrganizationInvites/hooks/calculateExpiry'

export const OrganizationInvites: CollectionConfig = {
  slug: 'organization-invites',
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'expiresAt', 'status', 'createdAt'],
  },
  hooks: {
    beforeChange: [calculateExpiry],
  },
  fields: [
    {
      name: 'inviteLink',
      type: 'ui',
      admin: {
        components: {
          Field: '@/payload/collections/OrganizationInvites/components/InviteLinkField',
        },
      },
    },
    {
      name: 'code',
      type: 'text',
      unique: true,
      required: true,
      defaultValue: () => crypto.randomBytes(16).toString('hex'),
      admin: {
        description: 'The secure code used for the invite link.',
        position: 'sidebar',
        readOnly: true,
      }
    },
    {
      name: 'expiresIn',
      label: 'Expires In',
      type: 'select',
      defaultValue: '1week',
      options: [
        {label: '12 hours', value: '12hours'},
        {label: '1 day', value: '1day'},
        {label: '3 days', value: '3days'},
        {label: '1 week', value: '1week'},
        {label: '1 month', value: '1month'},
        {label: 'Custom Date', value: 'custom'},
      ],
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      defaultValue: () => {
        const date = new Date();

        date.setDate(date.getDate() + 7); // Default to 7 days

        return date;
      },
      admin: {
        condition: (data) => data?.expiresIn === 'custom',
        date: {
          pickerAppearance: 'dayAndTime',
        }
      }
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {label: 'Pending', value: 'pending'},
        {label: 'Registered', value: 'registered'},
        {label: 'Completed', value: 'completed'},
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      }
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
      admin: {
        position: 'sidebar',
        readOnly: true,
      }
    },
  ],
}
