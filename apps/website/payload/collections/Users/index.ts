import {CollectionConfig} from "payload";
import {adminOnlyFieldAccess} from "@/payload/access/adminOnlyFieldAccess";
import {checkRole} from "@/payload/access/utilities";
import {publicAccess} from "@/payload/access/publicAccess";
import {adminOnly} from "@/payload/access/adminOnly";
import {adminOrSelf} from "@/payload/access/adminOrSelf";
import {ensureFirstUserIsAdmin} from "@/payload/collections/Users/hooks/ensureFirstUserIsAdmin";
import {publicFieldAccess} from "@/payload/access/publicFieldAccess";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: ({ req: { user } }) => checkRole(["admin", "organizer"], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ["name", "email", "roles", "organization.name"],
    useAsTitle: "name",
    hidden: ({user}) => {
      return !user.roles.includes('admin')
    }
    // hidden: ({user}) => checkRole(['admin'], user)
  },
  defaultSort: ["-updatedAt", "createdAt"],
  auth: {
    // tokenExpiration: 7200, // How many seconds to keep the user logged in
    // verify: true, // Require email verification before being allowed to authenticate
  },
  fields: [
    {
      name: "name",
      label: "Username",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      access: {
        create: adminOnlyFieldAccess,
        read: publicFieldAccess,
        update: adminOnlyFieldAccess,
      },
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      required: true,
      defaultValue: ['organizer'],
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "organizer",
          value: "organizer",
        },
      ],
    },
    // {
    //   type: 'group',
    //   name: 'organization',
    //   label: 'Organization',
    //   admin: {
    //     condition: (
    //       data,
    //       siblingData,
    //     ) => {
    //       return (
    //         data?.roles?.includes('organizer')
    //       );
    //     },
    //   },
    //   fields: [
    //     {
    //       name: 'name',
    //       type: 'text',
    //       required: true,
    //     }
    //   ],
    // }
  ],
};
