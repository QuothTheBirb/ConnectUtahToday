export const defaultEventTypes = [
	{
		title: "Protests & Rallies",
		description:
			"Public demonstrations, rallies, and visibility events to support a cause or stand against injustice.",
		mobilizeEventTypes: ["RALLY", "SOLIDARITY_EVENT", "VISIBILITY_EVENT"],
	},
	{
		title: "Community Gathering",
		description:
			"Local meetups, house parties, and kickoff events to build connections and energy in your community.",
		mobilizeEventTypes: [
			"COMMUNITY",
			"MEETING",
			"HOUSE_PARTY",
			"BARNSTORM",
		],
	},
	{
		title: "Canvassing",
		description:
			"Door-to-door outreach, literature distribution, and local community canvassing.",
		mobilizeEventTypes: [
			"CANVASS",
			"COMMUNITY_CANVASS",
			"LITERATURE_DROP_OFF",
		],
	},
	{
		title: "Petitions & Letter Writing",
		description:
			"Write letters to officials, sign petitions, and gather signatures for important causes.",
		mobilizeEventTypes: [
			"LETTER_WRITING",
			"PETITION",
			"SIGNATURE_GATHERING",
		],
	},
	{
		title: "Phone & Text Banking",
		description:
			"Remote outreach via phone calls, text messages, and advocacy calls.",
		mobilizeEventTypes: [
			"PHONE_BANK",
			"TEXT_BANK",
			"AUTOMATED_PHONE_BANK",
			"ADVOCACY_CALL",
		],
	},
	{
		title: "Fundraiser",
		description:
			"Events that raise money to support local movement work and community efforts.",
		mobilizeEventTypes: ["FUNDRAISER"],
	},
	{
		title: "Town Hall & Forums",
		description:
			"Town hall meetings, debate watch parties, and public discussion forums.",
		mobilizeEventTypes: ["TOWN_HALL", "DEBATE_WATCH_PARTY"],
	},
	{
		title: "Meet & Greet",
		description:
			"Meet & greet events, office openings, and opportunities to connect with candidates and community leaders.",
		mobilizeEventTypes: ["MEET_GREET", "OFFICE_OPENING"],
	},
	{
		title: "Voter Registration",
		description:
			"Help register voters and support voter engagement in your community.",
		mobilizeEventTypes: ["VOTER_REG"],
	},
	{
		title: "Training & Workshops",
		description:
			"Skill-building sessions, trainings, and workshops for organizers and volunteers.",
		mobilizeEventTypes: ["TRAINING", "WORKSHOP"],
	},
	{
		title: "Friend-to-Friend Outreach",
		description:
			"Relational organizing — reach out to friends, family, and your personal network.",
		mobilizeEventTypes: ["FRIEND_TO_FRIEND_OUTREACH"],
	},
	{
		title: "Volunteer Support",
		description:
			"Logistical support like carpools, supply runs, and other behind-the-scenes volunteer coordination.",
		mobilizeEventTypes: ["CARPOOL"],
	},
] as const;
