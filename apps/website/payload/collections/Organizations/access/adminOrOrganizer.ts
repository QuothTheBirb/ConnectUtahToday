import type {Access} from "payload";
import {checkRole} from "@/payload/access/utilities";

/**
 * Organizers part of the document or the user is an admin.
 *
 * Useful to allow users to manage their own organizations, but not others.
 */
export const adminOrOrganizer: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(["admin"], user)) {
      return true;
    }

    return {
      organizer: {
        equals: user.id
      }
    }
  }

  return false;
};
