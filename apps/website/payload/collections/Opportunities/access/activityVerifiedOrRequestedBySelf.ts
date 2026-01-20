import type {Access, Where} from "payload";
import {checkRole} from "@/payload/access/utilities";

export const activityVerifiedOrRequestedBySelf: Access = ({ req: { user } }) => {
	if (user && checkRole(["admin"], user)) {
		return true;
	}

  const query: Where = {
    or: [
      {
        status: {
          equals: "verified",
        },
      },
      {
        requestedBy: {
          equals: user?.id,
        }
      }
    ]
  }

	return query;
};
