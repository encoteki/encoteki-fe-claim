import { createClient } from '@/lib/supabase/client'

export interface EligibilityData {
  address: string
  qty: number
}

export async function checkEligibility(address: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('eligibility')
    .select('address')
    .eq('address', address)
    .maybeSingle()

  if (error) {
    console.error('Supabase error:', error)
    return { address, qty: 0 } as EligibilityData
  }

  if (data) {
    return {
      address: data.address,
      qty: 1,
    } as EligibilityData
  }

  return {
    address,
    qty: 0,
  } as EligibilityData
}
