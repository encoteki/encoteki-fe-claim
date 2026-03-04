'use server'

import { createClient } from '@/lib/supabase/client'

export async function checkEligibility(address: string) {
  try {
    if (!address) {
      return { success: false, message: 'Address is required' }
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('eligibility')
      .select('address')
      .eq('address', address)
      .maybeSingle()

    if (error) {
      return { success: false, message: 'Eligibility check not found' }
    }

    return { success: true, data }
  } catch {
    return { success: false, message: 'Internal server error' }
  }
}
