import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit') ?? 50)
    const offset = Number(searchParams.get('offset') ?? 0)

    const { data, error } = await supabase
      .from('werm_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


