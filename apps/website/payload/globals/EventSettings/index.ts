import { GlobalConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";
import { CalendarTab } from "@/payload/globals/EventSettings/tabs/Calendar";
import { EventSourcesTab } from "@/payload/globals/EventSettings/tabs/EventSources";
import { EventTypesTab } from "@/payload/globals/EventSettings/tabs/EventTypes";

export const EventSettings: GlobalConfig = {
	slug: "event-settings",
	label: "Event Settings",
	access: {
		read: adminOnly,
		update: adminOnly,
	},
	admin: {
		group: "Settings",
	},
	fields: [
		{
			type: "tabs",
			tabs: [EventSourcesTab, EventTypesTab, CalendarTab],
		},
	],
};
