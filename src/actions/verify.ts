'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SiweMessage } from 'siwe'
import { sessionOptions, SessionData } from '@/lib/session'

export async function verifySignature(message: string, signature: string) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  try {
    const siweMessage = new SiweMessage(message)
    const { data } = await siweMessage.verify({ signature })

    if (data.nonce !== session.nonce) {
      return { ok: false, message: 'Invalid nonce' }
    }

    session.siwe = { address: data.address }
    session.nonce = undefined
    session.createdAt = Date.now()
    await session.save()

    return { ok: true }
  } catch (error) {
    console.error(error)
    session.destroy()
    return { ok: false, message: 'Invalid signature' }
  }
}
