'use server'

import { createClient } from '@/lib/supabase/client'

const PAGE_SIZE = 12

export async function getAllPartners(page: number = 1) {
  try {
    const supabase = createClient()
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error, count } = await supabase
      .from('partners')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('id', { ascending: true })

    if (error) {
      return { success: false, message: 'Failed to fetch partners' }
    }

    return {
      success: true,
      data: data ?? [],
      totalCount: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
      currentPage: page,
    }
  } catch {
    return { success: false, message: 'Internal server error' }
  }
}

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
