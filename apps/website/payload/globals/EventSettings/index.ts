import { GlobalConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";
import { CalendarTab } from "@/payload/globals/EventSettings/tabs/Calendar";
import { EventsTab } from "@/payload/globals/EventSettings/tabs/Events";

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
			tabs: [EventsTab, CalendarTab],
		},
	],
};
