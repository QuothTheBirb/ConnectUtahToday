import {GlobalConfig} from "payload";
import {BrandingTab} from "@/payload/globals/SiteSettings/tabs/Branding";
import {EventsTab} from "@/payload/globals/SiteSettings/tabs/Events";
import {OnboardingTab} from "@/payload/globals/SiteSettings/tabs/Onboarding";
import {PagesTab} from "@/payload/globals/SiteSettings/tabs/Pages";

// TODO: Create custom description component: https://payloadcms.com/docs/fields/overview#description

export const SiteSettings: GlobalConfig = {
	slug: "site-settings",
	label: "Site Settings",
	admin: {
		group: "Settings",
	},
  fields: [
    {
      type: 'tabs',
      tabs: [
        BrandingTab,
        PagesTab,
        EventsTab,
        OnboardingTab
      ]
    },
  ]
};
