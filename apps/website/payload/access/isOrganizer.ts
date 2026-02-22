import {Access} from "payload";
import {checkRole} from "@/payload/access/utilities";

export const isOrganizer: Access = ({ req: { user } }) => {
  if (user) return checkRole(["admin", "organizer"], user);

  return false;
};
