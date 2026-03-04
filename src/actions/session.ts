'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData, SESSION_DURATION_MS } from '@/lib/session'

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  if (session.siwe) {
    const now = Date.now()
    const elapsed = now - (session.createdAt ?? 0)

    if (elapsed > SESSION_DURATION_MS) {
      session.destroy()
      return { isLoggedIn: false as const }
    }

    return { isLoggedIn: true, address: session.siwe.address }
  }

  return { isLoggedIn: false as const }
}

export async function deleteSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )
  session.destroy()
  return { isLoggedOut: true }
}
