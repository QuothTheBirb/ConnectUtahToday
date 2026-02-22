import type { Access, Where } from "payload";
import { checkRole } from "@/payload/access/utilities";

/**
 * Admins, the user themselves, or other users in the same organization.
 */
export const adminSelfOrSameOrganization: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) return true;

    if (checkRole(['organizer'], user)) {
      const query: Where = {
        or: [
          {
            id: {
              equals: user.id,
            },
          },
          {
            'organizations.organizers': {
              contains: user.id,
            },
          },
        ],
      };

      return query;
    }

    return {
      id: {
        equals: user.id,
      },
    };
  }

  return false;
};
