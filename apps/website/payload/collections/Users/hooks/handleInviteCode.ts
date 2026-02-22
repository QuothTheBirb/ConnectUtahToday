import {CollectionBeforeChangeHook} from 'payload'

export const handleInviteCode: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === 'create') {
    // If there is an invite code, validate it
    if (data.inviteCode) {
      const invite = await req.payload.find({
        collection: 'organization-invites',
        where: {
          code: {equals: data.inviteCode},
          status: {equals: 'pending'},
          expirationDate: {greater_than: new Date().toISOString()},
        },
      })

      if (invite.docs.length > 0) {
        const inviteDoc = invite.docs[0]
        // Grant organizer role
        data.roles = ['organizer']
        // Link to the invite
        data.invite = inviteDoc.id
        // Store invite ID in context to mark as used in afterChange
        req.context.inviteId = inviteDoc.id
      } else {
        throw new Error('Invalid or expired invite code.')
      }
    } else {
      // If no invite code and not an admin, we might want to prevent setting 'organizer' role
      // or even prevent registration if that's the requirement.
      // For now, let's just ensure they don't get the organizer role if they aren't created by an admin
      if (!req.user || !req.user.roles.includes('admin')) {
        data.roles = []
      }
    }
  }
  return data
}
