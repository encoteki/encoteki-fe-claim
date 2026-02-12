import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  if (session.siwe) {
    return Response.json({
      isLoggedIn: true,
      address: session.siwe.address,
    })
  }

  return Response.json({
    isLoggedIn: false,
  })
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )
  session.destroy()
  return Response.json({ isLoggedOut: true })
}
