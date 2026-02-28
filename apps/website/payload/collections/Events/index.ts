import {CollectionConfig} from "payload";
import {adminSelfOrOrganizer} from "@/payload/collections/Events/access/adminSelfOrOrganizer";
import {isOrganizer} from "@/payload/access/isOrganizer";
import {US_STATES} from "@/lib/usStates";
import {SUPPORTED_COUNTRIES} from "@/lib/supportedCountries";

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: isOrganizer,
    delete: adminSelfOrOrganizer,
    read: adminSelfOrOrganizer,
    update: adminSelfOrOrganizer,
  },
  admin: {
    defaultColumns: ['title', 'date', 'source', 'organization'],
    useAsTitle: 'title',
  },
  // enableQueryPresets: true,
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of this event.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      admin: {
        description: 'A brief description of this event.',
      },
    },
    {
      name: 'url',
      label: 'Event URL',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date/Time',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date/Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'eventType',
      label: 'Event Type',
      type: 'text',
    },
    {
      name: 'source',
      label: 'Source',
      type: "select",
      defaultValue: 'local',
      options: [
        {
          label: 'Local',
          value: 'local',
        },
        {
          label: 'Google Calendar',
          value: 'googleCalendar',
        },
        {
          label: 'Mobilize',
          value: 'mobilize',
        },
      ]
    },
    // Local
    {
      name: 'local',
      label: 'Local',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'local',
      },
      fields: [
        {
          name: 'image',
          label: 'Event Image',
          type: 'upload',
          relationTo: 'event-assets'
        },
        {
          name: 'organization',
          type: 'relationship',
          relationTo: 'organizations',
          label: 'Organization',
        },
        {
          name: 'createdBy',
          type: 'relationship',
          relationTo: 'users',
          defaultValue: ({ user }) => user?.id,
          admin: {
            readOnly: true,
            description: 'The user who created this event. This is only visible to site administrators.',
          },
          required: true,
        }
      ]
    },
    // Google Calendar
    // Mobilize
    {
      name: 'mobilize',
      label: 'Mobilize',
      type: "group",
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'mobilize',
        readOnly: true,
      },
      required: true,
      fields: [
        {
          name: 'eventId',
          label: 'Event ID',
          type: 'number',
          required: true
        },
        {
          name: 'image',
          label: 'Event Image URL',
          type: 'text',
        },
        {
          name: 'organization',
          label: 'Organization',
          type: 'group',
          fields: [
            {
              name: 'id',
              label: 'Organization ID',
              type: 'number',
              required: true
            },
            {
              name: 'name',
              label: 'Name',
              type: 'text',
              required: true
            },
            {
              name: 'slug',
              label: 'Slug',
              type: 'text',
              required: true
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true
            },
            {
              name: 'state',
              label: 'State',
              type: 'text'
            }
          ]
        },
      ]
    },
  ]
	slug: 'events',
	access: {
		create: isOrganizer,
		delete: adminSelfOrOrganizer,
		read: adminSelfOrOrganizer,
		update: adminSelfOrOrganizer,
	},
	admin: {
		defaultColumns: ['title', 'date', 'source', 'organization'],
		useAsTitle: 'title',
	},
	// enableQueryPresets: true,
	fields: [
		{
			name: 'title',
			label: 'Title',
			type: 'text',
			required: true,
			admin: {
				description: 'The name of this event.',
			},
		},
		{
			name: 'description',
			type: 'textarea',
			label: 'Description',
			required: true,
			admin: {
				description: 'A brief description of this event.',
			},
		},
		{
			name: 'url',
			label: 'Event URL',
			type: 'text',
			required: true,
		},
		{
			name: 'date',
			type: 'date',
			label: 'Date/Time',
			required: true,
			admin: {
				date: {
					pickerAppearance: 'dayAndTime',
				},
			},
		},
		{
			name: 'endDate',
			type: 'date',
			label: 'End Date/Time',
			admin: {
				date: {
					pickerAppearance: 'dayAndTime',
				},
			},
		},
		{
			name: 'location',
			type: 'group',
			fields: [
				{
					name: 'country',
					label: 'Country',
					type: 'select',
					options: [...SUPPORTED_COUNTRIES],
					defaultValue: 'US',
				},
				{
					name: 'state',
					label: 'State',
					type: 'select',
					options: [...US_STATES],
					defaultValue: 'UT',
				},
				{
					name: 'city',
					label: 'City',
					type: "text",
				},
				{
					name: 'address',
					label: 'Address',
					type: "text",
				},
				{
					name: 'postalCode',
					label: 'Postal Code',
					type: "text",
				},
				{
					name: 'venue',
					label: 'Meeting Location',
					type: "text",
				}
			]
		},
		{
			name: 'eventType',
			label: 'Event Type',
			type: 'text',
		},
		{
			name: 'source',
			label: 'Source',
			type: "select",
			defaultValue: 'local',
			options: [
				{
					label: 'Local',
					value: 'local',
				},
				{
					label: 'Google Calendar',
					value: 'googleCalendar',
				},
				{
					label: 'Mobilize',
					value: 'mobilize',
				},
			]
		},
		// Local
		{
			name: 'local',
			label: 'Local',
			type: 'group',
			admin: {
				condition: (_, siblingData) => siblingData?.source === 'local',
			},
			fields: [
				{
					name: 'images',
					label: 'Event Images',
					type: 'upload',
					relationTo: 'event-assets',
					hasMany: true,
				},
				{
					name: 'organization',
					type: 'relationship',
					relationTo: 'organizations',
					label: 'Organization',
				},
				{
					name: 'createdBy',
					type: 'relationship',
					relationTo: 'users',
					defaultValue: ({user}) => user?.id,
					admin: {
						readOnly: true,
						description: 'The user who created this event. This is only visible to site administrators.',
					},
					required: true,
				}
			]
		},
		// Google Calendar
		// Mobilize
		{
			name: 'mobilize',
			label: 'Mobilize',
			type: "group",
			admin: {
				condition: (_, siblingData) => siblingData?.source === 'mobilize',
				readOnly: true,
			},
			required: true,
			fields: [
				{
					name: 'eventId',
					label: 'Event ID',
					type: 'number',
					required: true
				},
				{
					name: 'image',
					label: 'Event Image URL',
					type: 'text',
				},
				{
					name: 'organization',
					label: 'Organization',
					type: 'group',
					fields: [
						{
							name: 'orgId',
							label: 'Organization ID',
							type: 'number',
							required: true
						},
						{
							name: 'name',
							label: 'Name',
							type: 'text',
							required: true
						},
						{
							name: 'slug',
							label: 'Slug',
							type: 'text',
							required: true
						},
						{
							name: 'url',
							label: 'URL',
							type: 'text',
							required: true
						},
					]
				},
			]
		},
	]
}
