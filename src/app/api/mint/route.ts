import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase configuration for mint API')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

type Amounts = { gold?: number; silver?: number; bronze?: number }
type WermTier = 'gold' | 'silver' | 'bronze'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

interface BankIdRow { id: string }
interface PolicyRow {
  id: string
  operation: 'mint' | 'distribution' | 'burn'
  status: 'active' | 'inactive' | 'draft'
  gold_reward: number | null
  silver_reward: number | null
  bronze_reward: number | null
}
interface BankSupplyRow {
  digital_amount: number
  physical_amount: number
}
interface EmployeeBalancesRow {
  id: string
  email: string
  werm_balances: Record<string, number>
}

async function getDefaultBankId(): Promise<string> {
  const { data, error } = await supabase
    .from('banks')
    .select('id')
    .eq('is_default', true)
    .limit(1)
    .maybeSingle()

  if (error || !isObject(data) || typeof (data as BankIdRow).id !== 'string') {
    throw new Error('Default bank not found')
  }
  return (data as BankIdRow).id
}

async function getPolicyTotals(policyId: string): Promise<Amounts & { operation: string; status: string }> {
  const { data, error } = await supabase
    .from('policies')
    .select('id, operation, status, gold_reward, silver_reward, bronze_reward')
    .eq('id', policyId)
    .single()

  if (error || !isObject(data)) throw new Error('Policy not found')
  const row = data as PolicyRow
  const operation = row.operation
  const status = row.status
  if (operation !== 'mint' && operation !== 'distribution' && operation !== 'burn') {
    throw new Error('Invalid policy operation')
  }
  if (status !== 'active' && status !== 'inactive' && status !== 'draft') {
    throw new Error('Invalid policy status')
  }
  return {
    operation,
    status,
    gold: Number(row.gold_reward ?? 0),
    silver: Number(row.silver_reward ?? 0),
    bronze: Number(row.bronze_reward ?? 0),
  }
}

async function incrementBankSupply(bankId: string, amounts: Amounts) {
  const entries: Array<{ t: 'gold' | 'silver' | 'bronze'; v: number }> = []
  if (amounts.gold && amounts.gold > 0) entries.push({ t: 'gold', v: amounts.gold })
  if (amounts.silver && amounts.silver > 0) entries.push({ t: 'silver', v: amounts.silver })
  if (amounts.bronze && amounts.bronze > 0) entries.push({ t: 'bronze', v: amounts.bronze })

  for (const { t, v } of entries) {
    const { data: row, error: selErr } = await supabase
      .from('bank_coin_supply')
      .select('digital_amount, physical_amount')
      .eq('bank_id', bankId)
      .eq('werm_type', t)
      .single()
    if (selErr || !isObject(row)) throw new Error('Failed to load bank supply row')
    const current = row as unknown as BankSupplyRow
    const nextDigital = Number(current.digital_amount ?? 0) + v
    const nextPhysical = Number(current.physical_amount ?? 0) + v
    const { error: updErr } = await supabase
      .from('bank_coin_supply')
      .update({ digital_amount: nextDigital, physical_amount: nextPhysical })
      .eq('bank_id', bankId)
      .eq('werm_type', t)
    if (updErr) throw updErr
  }
}

async function incrementBankEmployeeBalances(amounts: Amounts) {
  const { data: bankEmp, error } = await supabase
    .from('employees')
    .select('id, email, werm_balances')
    .eq('id', 'bank')
    .single()
  if (error || !isObject(bankEmp)) throw new Error('Bank employee not found')
  const bankRow = bankEmp as unknown as EmployeeBalancesRow
  const balances = { ...bankRow.werm_balances }
  balances.gold = (balances.gold ?? 0) + (amounts.gold ?? 0)
  balances.silver = (balances.silver ?? 0) + (amounts.silver ?? 0)
  balances.bronze = (balances.bronze ?? 0) + (amounts.bronze ?? 0)

  const { error: updErr } = await supabase
    .from('employees')
    .update({ werm_balances: balances })
    .eq('id', 'bank')
  if (updErr) throw updErr
}

async function logMintTransactions(amounts: Amounts, policyId?: string) {
  const rows: Array<Record<string, unknown>> = []
  const push = (t: WermTier, v?: number) => {
    if (!v || v <= 0) return
    rows.push({
      sender_id: null,
      receiver_id: 'bank',
      sender_email: 'system',
      receiver_username: 'bank',
      werm_type: t,
      amount: v,
      value_aud: 0,
      total_werms: 0,
      description: 'Mint via policy',
      policy_id: policyId ?? null,
      source: 'policy',
      status: 'completed',
    })
  }

  push('gold', amounts.gold)
  push('silver', amounts.silver)
  push('bronze', amounts.bronze)

  if (rows.length === 0) return
  const { error } = await supabase.from('werm_transactions').insert(rows)
  if (error) throw error
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const policyId: string | undefined = body?.policyId
    const explicit: Amounts | undefined = body?.amounts

    const bankId = await getDefaultBankId()

    let amounts: Amounts
    if (policyId) {
      const totals = await getPolicyTotals(policyId)
      if (totals.operation !== 'mint') {
        return NextResponse.json({ error: 'Policy is not a mint policy' }, { status: 400 })
      }
      if (totals.status !== 'active') {
        return NextResponse.json({ error: 'Policy is not active' }, { status: 400 })
      }
      amounts = { gold: totals.gold, silver: totals.silver, bronze: totals.bronze }
    } else if (explicit) {
      amounts = explicit
    } else {
      return NextResponse.json({ error: 'Provide policyId or amounts' }, { status: 400 })
    }

    await incrementBankSupply(bankId, amounts)
    await incrementBankEmployeeBalances(amounts)
    await logMintTransactions(amounts, policyId)

    return NextResponse.json({
      data: {
        bankId,
        minted: amounts,
        policyId: policyId ?? null,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


