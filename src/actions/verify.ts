'use server'

import { getIronSession } from 'iron-session'
import { cookies, headers } from 'next/headers'
import { SiweMessage } from 'siwe'
import { sessionOptions, SessionData } from '@/lib/session'

export async function verifySignature(message: string, signature: string) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  try {
    const headersList = await headers()
    const host = headersList.get('host') ?? ''
    const origin = headersList.get('origin') ?? ''

    const siweMessage = new SiweMessage(message)
    const { data } = await siweMessage.verify({ signature })

    // Prevent cross-domain replay attacks
    if (data.domain !== host) {
      session.destroy()
      return { ok: false, message: 'Domain mismatch' }
    }

    if (origin && !data.uri.startsWith(origin)) {
      session.destroy()
      return { ok: false, message: 'URI mismatch' }
    }

    if (data.nonce !== session.nonce) {
      session.destroy()
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
