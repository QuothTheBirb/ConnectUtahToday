import { GlobalConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";
import { LocationTab } from "@/payload/globals/SiteSettings/tabs/Location";
import { SiteDisclaimerTab } from "@/payload/globals/SiteSettings/tabs/SiteDisclaimer";

// TODO: Create custom description component: https://payloadcms.com/docs/fields/overview#description

export const SiteSettings: GlobalConfig = {
	slug: "site-settings",
	label: "Site Settings",
	admin: {
		group: "Settings",
	},
	access: {
		read: adminOnly,
		update: adminOnly,
	},
	fields: [
		{
			type: "tabs",
			tabs: [SiteDisclaimerTab, LocationTab],
		},
	],
};
