import {CollectionConfig} from "payload";
import {adminOnlyFieldAccess} from "@/payload/access/adminOnlyFieldAccess";
import {checkRole} from "@/payload/access/utilities";
import {publicAccess} from "@/payload/access/publicAccess";
import {adminOnly} from "@/payload/access/adminOnly";
import {adminOrSelf} from "@/payload/access/adminOrSelf";
import {ensureFirstUserIsAdmin} from "@/payload/collections/Users/hooks/ensureFirstUserIsAdmin";
import {handleInviteCode} from "@/payload/collections/Users/hooks/handleInviteCode";
import {markInviteUsed} from "@/payload/collections/Users/hooks/markInviteUsed";
import {publicFieldAccess} from "@/payload/access/publicFieldAccess";
import {adminSelfOrSameOrganization} from "@/payload/collections/Users/access/adminSelfOrSameOrganization";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: ({ req: { user } }) => checkRole(["admin", "organizer"], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminSelfOrSameOrganization,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ["username", "email", "roles", "organization.name"],
    useAsTitle: "username",
    hidden: ({user}) => {
      return !user.roles.includes('admin')
    }
  },
  defaultSort: ["-updatedAt", "createdAt"],
  hooks: {
    beforeChange: [handleInviteCode],
    afterChange: [markInviteUsed],
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false
    },
  },
  fields: [
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email'
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
      defaultValue: [],
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
    {
      name: 'inviteCode',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'invite',
      type: 'relationship',
      relationTo: 'organization-invites',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'organizations',
      type: 'join',
      hasMany: true,
      collection: 'organizations',
      on: 'organizers'
    }
  ],
};
