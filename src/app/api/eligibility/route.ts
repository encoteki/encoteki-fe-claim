import { createClient } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return Response.json(
        { success: false, message: 'Address id is required' },
        { status: 400 },
      )
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('eligibility')
      .select('address')
      .eq('address', address)
      .maybeSingle()

    if (error) {
      return Response.json(
        { success: false, message: 'Eligibility check not found' },
        { status: 404 },
      )
    }

    return Response.json({
      success: true,
      data: data,
    })
  } catch (error) {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    )
  }
}
