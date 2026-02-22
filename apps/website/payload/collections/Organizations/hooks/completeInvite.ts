import {CollectionAfterChangeHook} from 'payload'

export const completeInvite: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation === 'create') {
    // doc.organizer is the user ID
    const organizerId = typeof doc.organizer === 'object' ? doc.organizer.id : doc.organizer

    if (organizerId) {
      const user = await req.payload.findByID({
        collection: 'users',
        id: organizerId,
      }) as any

      if (user && user.invite) {
        const inviteId = typeof user.invite === 'object' ? user.invite.id : user.invite

        await req.payload.update({
          collection: 'organization-invites',
          id: inviteId,
          data: {
            status: 'accepted',
          },
        })
      }
    }
  }
}
