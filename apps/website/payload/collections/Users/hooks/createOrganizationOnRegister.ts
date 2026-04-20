import type { RequiredDataFromCollectionSlug } from "payload";

import { CollectionAfterChangeHook } from "payload";

export const createOrganizationOnRegister: CollectionAfterChangeHook = async ({
	doc,
	req,
	operation,
}) => {
	if (operation === "create" && doc.organizationName) {
		const description = doc.organizationDescription
			? {
					root: {
						type: "root",
						format: "" as const,
						indent: 0,
						version: 1,
						children: [
							{
								type: "paragraph",
								format: "",
								indent: 0,
								version: 1,
								children: [
									{
										mode: "normal",
										text: doc.organizationDescription,
										type: "text",
										style: "",
										detail: 0,
										version: 1,
									},
								],
								direction: "ltr" as const,
							},
						],
						direction: "ltr" as const,
					},
				}
			: null;

		const organization: Omit<
			RequiredDataFromCollectionSlug<"organizations">,
			"slug"
		> = {
			name: doc.organizationName,
			description: description,
			organizers: [doc.id],
			publicContactMethods: {
				showEmail: doc.organizationContactMethods?.email || false,
				contactEmail: doc.organizationContactEmail,
				showPhone: doc.organizationContactMethods?.phone || false,
				contactPhone: doc.organizationContactPhone,
				showWebsite: doc.organizationContactMethods?.website || false,
				contactWebsite: doc.organizationContactPage,
			},
		};

		// @ts-ignore
		await req.payload.create({
			collection: "organizations",
			data: organization,
		});
	}
};
