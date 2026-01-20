import type {Access, Where} from "payload";
import {checkRole} from "@/payload/access/utilities";

export const activityRequestedBySelf: Access = ({ req: { user } }) => {
  if (user && checkRole(["admin"], user)) {
    return true;
  }

  const query: Where = {
    requestedBy: {
      equals: user?.id,
    }
  }

  return query;
};
