import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return Response.json(
        { success: false, message: 'Partner id is required' },
        { status: 400 },
      )
    }

    const id = Number(idParam)
    if (isNaN(id)) {
      return Response.json(
        { success: false, message: 'Partner id  must be a number' },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    )

    if (!session.siwe?.address) {
      return Response.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 },
      )
    }

    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('code')
      .eq('partner', id)
      .single()

    if (error) {
      return Response.json(
        { success: false, message: 'Partner not found' },
        { status: 404 },
      )
    }

    return Response.json({
      success: true,
      data: data,
    })
  } catch (error) {
    return Response.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
