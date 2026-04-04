import { Tab } from "payload";
import { SUPPORTED_COUNTRIES } from "@/lib/supportedCountries";
import { US_STATES } from "@/lib/usStates";

export const LocationTab: Tab = {
	name: "location",
	label: "Location",
	fields: [
		{
			name: "defaultCountry",
			label: "Default Country",
			type: "select",
			options: [...SUPPORTED_COUNTRIES],
			defaultValue: "US",
		},
		{
			name: "defaultState",
			label: "Default State",
			type: "select",
			options: [...US_STATES],
		},
	],
};
