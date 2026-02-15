import crypto from 'crypto'

export const generateCode = (size?: number) => {
  return crypto.randomBytes(size ?? 16).toString('hex').toUpperCase();
}
