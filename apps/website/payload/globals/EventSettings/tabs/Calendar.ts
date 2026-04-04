import { Tab } from "payload";

export const CalendarTab: Tab = {
	name: "calendar",
	label: "Calendar",
	fields: [
		{
			label: "Event Calendar",
			type: "group",
			fields: [
				{
					name: "monthsRange",
					type: "number",
					label: "Months Range",
					defaultValue: 6,
					min: 0,
					max: 12,
					required: true,
					admin: {
						description:
							"The range of how many past and future months are displayed in the calendar view. Max 12 months. For example, a months range of 6 months will display the current month, the past 6 months, and the next 6 months.",
					},
				},
				{
					name: "syncInterval",
					label: "Calendar Update Interval (minutes)",
					type: "number",
					min: 5,
					defaultValue: 30,
					required: true,
					admin: {
						description:
							"Synchronize with all event sources and update calendar events.",
					},
				},
				{
					name: "manualSync",
					type: "ui",
					admin: {
						components: {
							Field: {
								path: "/payload/fields/syncEvents/component#SyncEvents",
							},
						},
					},
				},
			],
		},
	],
};
