'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'

const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

export async function checkEligibility(address: string) {
  try {
    if (!address) {
      return { success: false, message: 'Address is required' }
    }

    if (!EVM_ADDRESS_RE.test(address)) {
      return { success: false, message: 'Invalid address format' }
    }

    const { data, error } = await supabaseAdmin
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
