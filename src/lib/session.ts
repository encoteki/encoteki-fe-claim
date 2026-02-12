import { SessionOptions } from 'iron-session'

export interface SessionData {
  nonce?: string
  siwe?: {
    address: string
  }
}

if (!process.env.IRON_SESSION_PASSWORD) {
  throw new Error('cookie password is not defined')
}

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD,
  cookieName: 'siwe-encoteki-claim',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
