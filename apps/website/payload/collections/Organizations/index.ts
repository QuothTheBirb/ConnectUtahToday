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
							name: "url",
							label: "Organization Link",
							type: "text",
							required: true,
							// TODO: Add validation to input
						},
						{
							name: "mobilizeSlug",
							label: "Mobilize Organization Slug/URL",
							type: "text",
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
					label: "Calendar Sync",
					fields: [
						{
							name: "enableGoogleCalendarSync",
							label: "Enable Google Calendar Sync",
							type: "checkbox",
							defaultValue: false,
							admin: {
								description:
									"Allow this organization to sync events from a Google Calendar. This feature must be enabled in the global Event Settings.",
							},
							validate: async (val, { req }) => {
								if (val === true) {
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
			],
		},
	],
};
