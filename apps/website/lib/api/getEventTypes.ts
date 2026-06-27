"use server";

import config from "@payload-config";
import { getPayload } from "payload";

import "@/payload-types";

import { EventSetting } from "@/payload-types";

export const getEventTypes = async (): Promise<
	NonNullable<EventSetting["eventTypes"]> | []
> => {
	const payload = await getPayload({ config });

	try {
		const eventSettings = await payload.findGlobal({
			slug: "event-settings",
			overrideAccess: true,
		});

		if (!eventSettings.eventTypes) return [];

		return eventSettings.eventTypes;
	} catch (error) {
		console.error("Error fetching event types:", error);
		return [];
	}
};
