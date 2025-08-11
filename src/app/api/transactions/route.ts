import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') ?? 50)
    const offset = Number(searchParams.get('offset') ?? 0)
    const employeeId = searchParams.get('employeeId')
    const slackUsername = searchParams.get('slackUsername')

    let query = supabase
      .from('werm_transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (employeeId) {
      query = query.or(`receiver_id.eq.${employeeId},sender_id.eq.${employeeId}`)
    }
    if (slackUsername) {
      query = query.eq('receiver_username', slackUsername)
    }

    const { data, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


