'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function getDeal(id: number) {
  try {
    if (!Number.isInteger(id) || id < 1 || id > 1_000_000) {
      return { success: false, message: 'Invalid partner id' }
    }

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    )

    if (!session.siwe?.address) {
      return { success: false, message: 'Unauthorized' }
    }

    const { data, error } = await supabaseAdmin
      .from('deals')
      .select('code')
      .eq('partner', id)
      .single()

    if (error) {
      return { success: false, message: 'Partner not found' }
    }

    return { success: true, data }
  } catch {
    return { success: false, message: 'Internal Server Error' }
  }
}
