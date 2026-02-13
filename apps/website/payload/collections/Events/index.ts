import {CollectionConfig} from "payload";
import {publicAccess} from "@/payload/access/publicAccess";
import {adminOrOrganizer} from "@/payload/collections/Organizations/access/adminOrOrganizer";

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: adminOrOrganizer,
    delete: adminOrOrganizer,
    read: publicAccess,
    update: adminOrOrganizer,
  },
  admin: {
    defaultColumns: ['title', 'date', 'source', 'organization'],
    useAsTitle: 'title',
  },
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
}
