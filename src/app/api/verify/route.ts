import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SiweMessage } from 'siwe'
import { sessionOptions, SessionData } from '@/lib/session'

export async function POST(request: Request) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  )
  const { message, signature } = await request.json()

  try {
    const siweMessage = new SiweMessage(message)
    const { data } = await siweMessage.verify({ signature })

    if (data.nonce !== session.nonce) {
      return Response.json({ message: 'Invalid nonce' }, { status: 422 })
    }

    session.siwe = {
      address: data.address,
    }
    session.nonce = undefined

    await session.save()

    return Response.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    session.destroy()
    return Response.json(
      { ok: false, message: 'Invalid signature' },
      { status: 500 },
    )
  }
}
