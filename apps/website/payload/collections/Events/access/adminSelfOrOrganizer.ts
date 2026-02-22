import type {Access, Where} from "payload";
import {checkRole} from "@/payload/access/utilities";

/**
 * Organizers part of the document or the user is an admin.
 *
 * Useful to allow users to manage their own organizations, but not others.
 */
export const adminSelfOrOrganizer: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) return true;

    if (checkRole(['organizer'], user)) {
      const query: Where = {
        or: [
          {
            'local.createdBy': {
              equals: user.id,
            },
          },
          {
            'local.organization.organizers': {
              contains: user.id,
            },
          },
        ],
      }

      return query;
    }
  }

  return false;
};
