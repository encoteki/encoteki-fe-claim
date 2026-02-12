import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { generateNonce } from 'siwe'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )

  const nonce = generateNonce()

  session.nonce = nonce
  await session.save()

  return new Response(nonce, { status: 200 })
}
