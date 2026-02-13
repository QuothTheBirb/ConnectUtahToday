import {CollectionBeforeChangeHook} from 'payload'

export const calculateExpiry: CollectionBeforeChangeHook = ({
  data,
  operation,
  originalDoc,
}) => {
  const shouldCalculate =
    operation === 'create' ||
    (operation === 'update' && data.expiresIn && data.expiresIn !== originalDoc?.expiresIn)

  if (shouldCalculate && data.expiresIn && data.expiresIn !== 'custom') {
    const date = new Date()
    switch (data.expiresIn) {
      case '12hours':
        date.setHours(date.getHours() + 12)
        break
      case '1day':
        date.setDate(date.getDate() + 1)
        break
      case '3days':
        date.setDate(date.getDate() + 3)
        break
      case '1week':
        date.setDate(date.getDate() + 7)
        break
      case '1month':
        date.setMonth(date.getMonth() + 1)
        break
    }
    data.expiresAt = date.toISOString()
  }
  return data
}
