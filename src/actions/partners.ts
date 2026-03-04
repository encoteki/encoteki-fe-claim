'use server'

import { createClient } from '@/lib/supabase/client'

export async function getPartner(id: number) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { success: false, message: 'Partner not found' }
    }

    return { success: true, data }
  } catch {
    return { success: false, message: 'Internal server error' }
  }
}
