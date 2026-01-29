import { createClient } from '@/lib/supabase/client'

export interface Partner {
  id: number
  name: string
  offer: string
  description: string
  tnc: string
  code: string
  image: string
  is_offline: boolean | undefined
}

export async function getDeals(id: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error:', error)
  }

  return data as Partner
}
