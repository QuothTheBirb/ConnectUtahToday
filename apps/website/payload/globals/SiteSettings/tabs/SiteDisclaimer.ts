import { Tab } from "payload";

export const SiteDisclaimerTab: Tab = {
	name: "site-disclaimer",
	label: "Site Disclaimer",
	fields: [
		{
			name: "enableSiteDisclaimer",
			label: "Enable Global Site Disclaimer",
			type: "checkbox",
			defaultValue: false,
		},
		{
			name: "title",
			label: "Disclaimer Title",
			type: "text",
			defaultValue: "Site Disclaimer",
			admin: {
				condition: (_, siblingData) =>
					siblingData?.enableSiteDisclaimer,
			},
		},
		{
			name: "message",
			label: "Disclaimer Message",
			type: "textarea",
			admin: {
				condition: (_, siblingData) =>
					siblingData?.enableSiteDisclaimer,
			},
		},
		{
			name: "buttonText",
			label: "Disclaimer Button Text",
			type: "text",
			defaultValue: "I Understand",
			admin: {
				condition: (_, siblingData) =>
					siblingData?.enableSiteDisclaimer,
			},
		},
	],
};
