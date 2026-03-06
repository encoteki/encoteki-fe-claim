'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'

const PAGE_SIZE = 12

const PARTNER_LIST_COLUMNS = 'id, name, offer, image, is_offline'

// Uses supabaseAdmin (no cookies) — safe inside unstable_cache which runs
// outside request context and cannot access Next.js cookies().
const fetchPartnerPage = unstable_cache(
  async (page: number) => {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error, count } = await supabaseAdmin
      .from('partners')
      .select(PARTNER_LIST_COLUMNS, { count: 'exact' })
      .range(from, to)
      .order('id', { ascending: true })

    if (error) {
      return { success: false as const, message: 'Failed to fetch partners' }
    }

    return {
      success: true as const,
      data: data ?? [],
      totalCount: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    }
  },
  ['partners-page'],
  { revalidate: 300, tags: ['partners'] },
)

export async function getAllPartners(page: number = 1) {
  try {
    return await fetchPartnerPage(page)
  } catch {
    return { success: false as const, message: 'Internal server error' }
  }
}

export async function getPartner(id: number) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('partners')
      .select('id, name, offer, description, tnc, image, is_offline')
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
