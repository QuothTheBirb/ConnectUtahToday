import { CollectionConfig, slugField } from "payload";
import { adminOnlyFieldAccess } from "@/payload/access/adminOnlyFieldAccess";
import { checkRole } from "@/payload/access/utilities";
import { adminOrOrganizer } from "@/payload/collections/Organizations/access/adminOrOrganizer";

export const Organizations: CollectionConfig = {
	slug: "organizations",
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
	defaultSort: ["name"],
	hooks: {
		// afterChange: [completeInvite],
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Organization Details",
					fields: [
						{
							name: "name",
							label: "Organization Name",
							type: "text",
							required: true,
						},
						slugField({
							useAsSlug: "name",
						}),
						{
							name: "mobilizeSlug",
							label: "Mobilize Organization Slug/URL",
							type: "text",
							admin: {
								description:
									"If your organization has events on Mobilize, please provide the slug or URL for your organization on Mobilize. This prevents duplicate events from being created from Mobilize if you use Google Calendar integration and ensures accurate event listings.",
							},
						},
						{
							name: "organizers",
							label: "Organizers",
							type: "relationship",
							hasMany: true,
							relationTo: "users",
							defaultValue: ({ user }) => {
								if (checkRole(["organizer"], user))
									return [
										{
											id: user?.id,
										},
									];
							},
							filterOptions: {
								roles: {
									contains: "organizer",
								},
							},
							required: true,
							access: {
								update: adminOnlyFieldAccess,
							},
						},
					],
				},
				{
					label: "Organization Page",
					fields: [
						{
							name: "logo",
							type: "upload",
							relationTo: "organization-assets",
						},
						{
							name: "publicContactMethods",
							label: "Public Contact Methods",
							type: "group",
							fields: [
								{
									name: "showEmail",
									label: "Show Contact Email",
									type: "checkbox",
									defaultValue: false,
								},
								{
									name: "contactEmail",
									label: "Public Contact Email",
									type: "email",
									admin: {
										condition: (data, siblingData) =>
											siblingData?.showEmail,
									},
								},
								{
									name: "contactEmailLabel",
									label: "Public Contact Email Label",
									type: "text",
									admin: {
										condition: (data, siblingData) =>
											siblingData?.showEmail,
										placeholder:
											"The label shown on the link to the email. Leave blank to use the default value: 'Email'.",
									},
								},
								{
									name: "showPhone",
									label: "Show Contact Phone",
									type: "checkbox",
									defaultValue: false,
								},
								{
									name: "contactPhone",
									label: "Public Contact Phone",
									type: "text",
									admin: {
										condition: (data, siblingData) =>
											siblingData?.showPhone,
									},
								},
								{
									name: "contactPhoneLabel",
									label: "Public Contact Phone Label",
									type: "text",
									admin: {
										condition: (data, siblingData) =>
											siblingData?.showPhone,
										placeholder:
											"The label shown on the link to the phone number. Leave blank to use the default value: 'Phone'.",
									},
								},
								{
									name: "showWebsite",
									label: "Show Website URL",
									type: "checkbox",
									defaultValue: false,
								},
								{
									name: "contactWebsite",
									label: "Public Website URL",
									type: "text",
									admin: {
										condition: (data, siblingData) =>
											siblingData?.showWebsite,
									},
								},
								{
									name: "contactWebsiteLabel",
									label: "Public Website Label",
									type: "text",
									admin: {
										condition: (data, siblingData) =>
											siblingData?.showWebsite,
										placeholder:
											"The label shown on the link to the website. Examples: 'Join us', 'Sign up', 'Learn more'. Leave blank to use the default value: 'Website'.",
									},
								},
							],
						},
						// {
						//   name: 'shortDescription',
						//   label: 'Short Description',
						//   type: 'richText',
						// },
						{
							name: "description",
							label: "Page Content",
							type: "richText",
						},
						{
							name: "opportunities",
							label: "Volunteering Opportunities",
							type: "relationship",
							relationTo: "opportunities",
							hasMany: true,
							admin: {
								sortOptions: "name",
							},
						},
					],
				},
				{
					label: "Calendar Sync",
					fields: [
						{
							name: "enableGoogleCalendarSync",
							label: "Enable Google Calendar Sync",
							type: "checkbox",
							defaultValue: false,
							admin: {
								description:
									"Allow this organization to sync events from a Google Calendar.",
							},
							validate: async (value, { req }) => {
								if (value === true) {
									const settings =
										await req.payload.findGlobal({
											slug: "event-settings",
										});
									if (
										!settings.events.googleCalendar
											?.enableOrganizationCalendars
									) {
										return "Organization Google Calendar synchronization is disabled in Event Settings.";
									}
								}
								return true;
							},
						},
						{
							name: "googleCalendarId",
							label: "Google Calendar ID",
							type: "text",
							required: true,
							admin: {
								condition: (data) =>
									data?.enableGoogleCalendarSync === true,
							},
						},
						{
							name: "defaultEventImage",
							label: "Default Event Image",
							type: "upload",
							relationTo: "organization-assets",
							admin: {
								description:
									"A default image used for calendar events from this organization when no event-specific image is available.",
							},
						},
					],
				},
			],
		},
	],
};
