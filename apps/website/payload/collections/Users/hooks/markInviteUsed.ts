import {CollectionAfterChangeHook} from 'payload'

export const markInviteUsed: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === 'create' && req.context.inviteId) {
    await req.payload.update({
      collection: 'organization-invites',
      id: req.context.inviteId as string,
      data: {
        status: 'registered',
        usedBy: doc.id,
      },
    })
  }
}
