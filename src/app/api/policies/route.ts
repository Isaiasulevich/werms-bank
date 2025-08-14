import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase configuration for policies API')
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface CreatedBy {
  name: string
  email: string
  role: string
}

function isCreatedBy(value: unknown): value is CreatedBy {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.name === 'string' &&
    typeof v.email === 'string' &&
    typeof v.role === 'string'
  )
}

function mapDbRowToPolicy(row: Database['public']['Tables']['policies']['Row']) {
  const totalGold = row.gold_reward ?? 0
  const totalSilver = row.silver_reward ?? 0
  const totalBronze = row.bronze_reward ?? 0

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    conditions: [
      {
        id: `${row.id}-cond-1`,
        type: 'custom',
        description: 'Fixed reward per policy execution',
        trigger: 'Per policy configuration',
        wormReward: {
          gold: totalGold > 0 ? totalGold : undefined,
          silver: totalSilver > 0 ? totalSilver : undefined,
          bronze: totalBronze > 0 ? totalBronze : undefined,
        },
        requiresApproval: row.approval_required,
        isActive: row.status === 'active',
      },
    ],
    createdBy: isCreatedBy(row.created_by)
      ? row.created_by
      : { name: 'Unknown', email: '', role: '' },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    effectiveDate: row.effective_at,
    expirationDate: row.expires_at ?? undefined,
    isSystemPolicy: row.is_system_policy,
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    let query = supabase
      .from('policies')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    const mapped = (data ?? []).map(mapDbRowToPolicy)
    return NextResponse.json({ data: mapped })
  } catch (err) {
    console.error('GET /api/policies error', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // policy form payload from client
    const {
      title,
      description,
      category,
      status,
      conditions = [],
      effectiveDate,
      expirationDate,
      isSystemPolicy = false,
    } = body || {}

    if (!title || !description || !category || !status || !effectiveDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    type WormReward = { gold?: number; silver?: number; bronze?: number }
    type IncomingCondition = { wormReward?: WormReward; requiresApproval?: boolean }
    function isIncomingCondition(v: unknown): v is IncomingCondition {
      if (!v || typeof v !== 'object') return false
      return true
    }
    const totals = (Array.isArray(conditions) ? conditions : []).reduce(
      (
        acc: { gold: number; silver: number; bronze: number; approval: boolean },
        c: unknown
      ) => {
        if (isIncomingCondition(c)) {
          acc.gold += c.wormReward?.gold ?? 0
          acc.silver += c.wormReward?.silver ?? 0
          acc.bronze += c.wormReward?.bronze ?? 0
          acc.approval = acc.approval || !!c.requiresApproval
        }
        return acc
      },
      { gold: 0, silver: 0, bronze: 0, approval: false }
    )

    // Simple mapping for operation based on category
    const operation = category === 'minting' ? 'mint' : 'distribution'

    const insertPayload: Database['public']['Tables']['policies']['Insert'] = {
      title,
      description,
      category,
      status,
      operation,
      execution_mode: 'manual',
      target_type: 'all',
      target_values: [],
      approval_required: totals.approval,
      gold_reward: totals.gold,
      silver_reward: totals.silver,
      bronze_reward: totals.bronze,
      created_by: body?.createdBy ?? { name: 'Unknown', email: '', role: '' },
      effective_at: new Date(effectiveDate).toISOString(),
      expires_at: expirationDate ? new Date(expirationDate).toISOString() : null,
      is_system_policy: !!isSystemPolicy,
      metadata: { source: 'ui', conditions },
    }

    const { data, error } = await supabase
      .from('policies')
      .insert(insertPayload)
      .select('*')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: String(error) }, { status: 500 })
    }

    return NextResponse.json({ data: mapDbRowToPolicy(data) })
  } catch (err) {
    console.error('POST /api/policies error', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


