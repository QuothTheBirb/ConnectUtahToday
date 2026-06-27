import { Tab } from "payload";
import { mobilizeEventTypes } from "@connect-utah-today/api/types";
import { defaultEventTypes } from "@/payload/globals/EventSettings/tabs/defaultEventTypes";

export const EventTypesTab: Tab = {
	label: "Event Types",
	fields: [
		{
			label: "Event Types",
			name: "eventTypes",
			type: "array",
			admin: {
				isSortable: true,
				components: {
					RowLabel: {
						path: "@/payload/components/ArrayRowLabel#ArrayRowLabel",
						clientProps: {
							baseLabel: "Event Type",
						},
					},
				},
			},
			fields: [
				{
					name: "title",
					type: "text",
					label: "Name",
					required: true,
				},
				{
					name: "description",
					type: "text",
					label: "Description",
				},
				{
					name: "mobilizeEventTypes",
					type: "select",
					label: "Mobilize Event Types",
					hasMany: true,
					admin: {
						placeholder:
							"Matching Mobilize event types, i.e. 'RALLY', 'MEET_GREET', 'TOWN_HALL'.",
					},
					options: Array.from(mobilizeEventTypes).filter(
						(eventType) => eventType !== "OTHER",
					),
				},
			],
			defaultValue: defaultEventTypes,
		},
		{
			name: "resetEventTypes",
			type: "ui",
			admin: {
				components: {
					Field: "@/payload/globals/EventSettings/components/ResetEventTypes/ResetEventTypes#ResetEventTypes",
				},
			},
		},
	],
};
