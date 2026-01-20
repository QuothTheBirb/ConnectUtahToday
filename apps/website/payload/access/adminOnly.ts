import { Access } from "payload";
import { checkRole } from "@/payload/access/utilities";

export const adminOnly: Access = ({ req: { user } }) => {
	if (user) return checkRole(["admin"], user);

	return false;
};
