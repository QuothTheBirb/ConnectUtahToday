import config from "@payload-config";
import {getPayload} from "payload";
import {Organization} from "@/payload-types";

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const payload = await getPayload({ config });

  try {
    const organizations = await payload.find({
      collection: 'organizations',
      depth: 1,
      pagination: false
    });

    if (!organizations.docs) return [];

    return organizations.docs;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}
