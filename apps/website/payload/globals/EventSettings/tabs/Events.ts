import { Tab } from "payload";
import { US_STATES } from "@/lib/usStates";

export const EventsTab: Tab = {
	name: "events",
	label: "Event Sources",
	fields: [
		{
			name: "localEvents",
			label: "Event Uploads",
			type: "group",
			admin: {
				description:
					"Configure site settings for events uploaded to the site through the dashboard.",
			},
			fields: [
				{
					name: "enableLocalEvents",
					label: "Enable local event uploads",
					type: "checkbox",
					defaultValue: false,
					admin: {
						// disabled: true
						// readOnly: true
					},
				},
			],
		},
		{
			name: "googleCalendar",
			label: "Google Calendar Integration",
			type: "group",
			admin: {
				description:
					"Configure site settings for Google Calendar events. Syncs with event calendar every 4 hours by default.",
			},
			fields: [
				{
					name: "enableGoogleCalendar",
					label: "Enable Google Calendar integration",
					type: "checkbox",
				},
				{
					name: "googleCalendarApiKey",
					label: "Google Calendar API Key",
					type: "text",
					required: true,
					admin: {
						description:
							"Get an API key from https://developers.google.com/calendar/quickstart/js",
						condition: (_, siblingData) => {
							return siblingData?.enableGoogleCalendar === true;
						},
					},
				},
				{
					name: "enableOrganizationCalendars",
					label: "Enable individual organization Google Calendar integration",
					type: "checkbox",
					admin: {
						description:
							"Allow organizers to add Google Calendar synchronization for their organization's events. This will allow them to add events to the organization's calendar and automatically update the events on the site.",
						condition: (_, siblingData) => {
							return siblingData?.enableGoogleCalendar === true;
						},
					},
				},
				{
					name: "googleCalendars",
					label: "Global Calendar Sources",
					type: "array",
					admin: {
						description:
							"Global calendars included in the event synchronization.",
						condition: (_, siblingData) => {
							return siblingData?.enableGoogleCalendar === true;
						},
					},
					fields: [
						{
							name: "name",
							label: "Calendar Name",
							type: "text",
						},
						{
							name: "calendarId",
							label: "Google Calendar ID",
							type: "text",
							required: true,
						},
					],
				},
			],
		},
		{
			type: "group",
			name: "mobilize",
			label: "Mobilize Integration",
			admin: {
				description:
					"Configure site settings for Mobilize events. Syncs with event calendar every 4 hours by default.",
			},
			fields: [
				{
					name: "enableMobilize",
					label: "Enable Mobilize integration",
					type: "checkbox",
				},
				{
					name: "mobilizeApiKey",
					label: "Mobilize API Key",
					type: "text",
					admin: {
						description: "Optional, currently unused.",
						condition: (_, siblingData) => {
							return siblingData?.enableMobilize === true;
						},
					},
				},
				{
					type: "collapsible",
					label: "Event Filters",
					admin: {
						initCollapsed: false,
						condition: (_, siblingData) => {
							return siblingData?.enableMobilize === true;
						},
					},
					fields: [
						// Temporarily locked and required until I can test further
						{
							name: "enableStateFilter",
							label: "Filter events by state",
							type: "checkbox",
							defaultValue: true,
							required: true,
							admin: {
								readOnly: true,
							},
						},
						// TODO: Finish implementing state filter
						{
							name: "stateFilter",
							type: "group",
							admin: {
								hideGutter: true,
								condition: (_, siblingData) => {
									return (
										siblingData?.enableStateFilter === true
									);
								},
								description:
									"Filter events by state. Required by default when enabling mobilize integration to limit total number of events fetched.",
							},
							fields: [
								{
									name: "state",
									type: "select",
									options: [...US_STATES],
									required: true,
								},
							],
						},
						{
							name: "enableOrganizationFilter",
							label: "Filter events by event organizers",
							type: "checkbox",
						},
						{
							name: "organizationFilter",
							type: "group",
							admin: {
								hideGutter: true,
								condition: (_, siblingData) => {
									return (
										siblingData?.enableOrganizationFilter ===
										true
									);
								},
							},
							fields: [
								{
									name: "type",
									label: "Filter type",
									type: "radio",
									required: true,
									options: [
										{
											label: "Allowlist",
											value: "allowlist",
										},
										{
											label: "Blocklist",
											value: "blocklist",
										},
									],
								},
								{
									type: "text",
									name: "list",
									hasMany: true,
									required: true,
									admin: {
										components: {
											Field: {
												path: "/payload/fields/OrganizationSelect#OrganizationSelect",
												clientProps: {
													fieldName: "Organizations",
												},
											},
										},
									},
								},
							],
						},
					],
				},
			],
		},
	],
};
