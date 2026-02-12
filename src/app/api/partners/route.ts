import { createClient } from '@/lib/supabase/client'

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

    const supabase = createClient()
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
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
      { success: false, message: 'Internal server error' },
      { status: 500 },
    )
  }
}
