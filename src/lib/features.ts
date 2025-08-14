import { WermType, WERM_PRICES, WERM_TYPES } from './wermTypes';
import { Employee } from '@/features/employees';
import { SlackWermTransferInput } from '@/features/employees/types';
import { WERM_EMOJIS } from './wermTypes';
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// TODO: TEST THIS FURTHER
function logWermCountByEmail(employees: Employee[], employeeEmail: string): void {
  const employee = employees.find(emp => emp.email === employeeEmail);
  
  if (!employee) {
    console.log(`No employee found with email: ${employeeEmail}`);
    return;
  }
} 

export function addToWermBalances(
  werm_balances: Record<WermType, number>,
  type: WermType,
  amount: number
) {
  const current = werm_balances[type] ?? 0;
  werm_balances[type] = current + amount;
}


//todo: ADD COMMENT FOR THE BEHAVIOUR OF THIS FUNCTIONALITY
//
export async function transferWerms(
  senderEmail: string,
  receiverUsername: string,
  wermsToTransfer: Partial<Record<WermType, number>>,
  note?: string
): Promise<void> {
  // Fetch sender and receiver
  const { data: employees, error } = await supabase
    .from('employees')
    .select('id, name, email, slack_username, werm_balances, lifetime_earned')
    .or(`email.eq.${senderEmail},slack_username.eq.${receiverUsername}`);

  if (error || !employees || employees.length !== 2) {
    throw new Error('Could not load sender or receiver from Supabase');
  }

  const sender = employees.find(e => e.email === senderEmail);
  const receiver = employees.find(e => e.slack_username === receiverUsername);
  if (!sender || !receiver) {
    throw new Error('Invalid sender or receiver.');
  }

  // Mutate balances in memory
  for (const [key, amount] of Object.entries(wermsToTransfer)) {
    const type = key as WermType;
    const amt = amount ?? 0;

    if ((sender.werm_balances[type] ?? 0) < amt) {
      throw new Error(`Not enough ${type} werms to complete the transfer.`);
    }

    sender.werm_balances[type] -= amt;
    receiver.werm_balances[type] = (receiver.werm_balances[type] ?? 0) + amt;
    receiver.lifetime_earned[type] = (receiver.lifetime_earned[type] ?? 0) + amt;
  }

  // Persist updates
  const { error: updateErr } = await supabase
    .from('employees')
    .upsert([
      {
        id: sender.id,
        name: sender.name,
        email: sender.email,
        slack_username: sender.slack_username,
        werm_balances: sender.werm_balances,
        lifetime_earned: sender.lifetime_earned
      },
      {
        id: receiver.id,
        name: receiver.name,
        email: receiver.email,
        slack_username: receiver.slack_username,
        werm_balances: receiver.werm_balances,
        lifetime_earned: receiver.lifetime_earned
      },
    ]);

  if (updateErr) {
    console.error(updateErr)
    throw new Error('Failed to update balances in Supabase');
  }

  // Log each coin transfer as a separate werm_transactions row
  const entries: Array<{
    sender_id: string | null
    receiver_id: string | null
    sender_email: string
    receiver_username: string
    werm_type: WermType
    amount: number
    value_aud: number
    total_werms?: number
    breakdown?: Record<string, number>
    description?: string
    policy_id?: string
    source?: string
    status?: string
  }> = []

  for (const [key, amount] of Object.entries(wermsToTransfer)) {
    const type = key as WermType
    const amt = amount ?? 0
    if (amt <= 0) continue
    entries.push({
      sender_id: sender.id,
      receiver_id: receiver.id,
      sender_email: sender.email,
      receiver_username: receiver.slack_username,
      werm_type: type,
      amount: amt,
      value_aud: amt * WERM_PRICES[type],
      total_werms: amt * WERM_PRICES[type],
      description: note,
      source: 'slack',
      status: 'completed',
    })
  }

  if (entries.length > 0) {
    const { error: logErr } = await supabase
      .from('werm_transactions')
      .insert(entries)
    if (logErr) {
      console.error('Failed to insert transaction logs', logErr)
    }
  }

  // Only when the bank is the SENDER do we decrement bank reserves
  const isBankSender = sender.id === 'bank'
  if (isBankSender) {
    // Resolve default bank id
    const { data: bankRow, error: bankErr } = await supabase
      .from('banks')
      .select('id')
      .eq('is_default', true)
      .limit(1)
      .maybeSingle()
    if (!bankErr && (bankRow as { id?: string } | null)?.id) {
      const bankId = (bankRow as { id: string }).id
      // Load current supply rows
      const { data: supplyRows, error: supplyErr } = await supabase
        .from('bank_coin_supply')
        .select('werm_type, digital_amount, physical_amount')
        .eq('bank_id', bankId)
      if (!supplyErr && Array.isArray(supplyRows)) {
        const deltas: Record<WermType, number> = {
          gold: 0,
          silver: 0,
          bronze: 0,
        }
        for (const [key, amount] of Object.entries(wermsToTransfer)) {
          const type = key as WermType
          const amt = amount ?? 0
          if (amt <= 0) continue
          // Bank sending reduces reserve
          deltas[type] -= amt
        }
        for (const row of (supplyRows as Array<{ werm_type: WermType; digital_amount: number; physical_amount: number }>)) {
          const delta = deltas[row.werm_type]
          if (!delta) continue
          const next = {
            digital_amount: Number(row.digital_amount ?? 0) + delta,
            physical_amount: Number(row.physical_amount ?? 0) + delta,
          }
          await supabase
            .from('bank_coin_supply')
            .update(next)
            .eq('bank_id', bankId)
            .eq('werm_type', row.werm_type)
        }
      }
    }
  }
}

// TODO: DOCUMENT
export function parseWermInput(input: string): SlackWermTransferInput | null {
  const tokens = input.trim().split(/\s+/);
  if (!tokens[0]?.startsWith("@")) return null;

  const username = tokens[0];
  const amounts: Partial<Record<WermType, number>> = {};

  let index = 1;

  const firstAmount = parseInt(tokens[index], 10);
  const nextToken = tokens[index + 1];

  if (
    !isNaN(firstAmount) && 
    (!nextToken || !WERM_TYPES.includes(nextToken as WermType))
  ) {
    amounts.bronze = firstAmount;

    index += 1;
  } else {
    while (index < tokens.length) {
      const amount = parseInt(tokens[index], 10);
      const type = tokens[index + 1] as WermType;
  
      if (!isNaN(amount) && WERM_TYPES.includes(type)) {
        amounts[type] = (amounts[type] ?? 0) + amount;
        index += 2;
      } else {
        break;
      }
    }
  }

  const reason = tokens.slice(index).join(" ").trim();
  return {
    username,
    amounts,
    reason: reason.length > 0 ? reason : undefined,
  };
}

// TODO: DOCUMENTATION
export function formatWermTransferMessage(
  amounts: Partial<Record<WermType, number>>,
  receiverUsername: string,
  note?: string
): string {
  const parts: string[] = [];

  for (const type of Object.keys(amounts) as WermType[]) {
    const count = amounts[type];
    if (count && count > 0) {
      parts.push(`${count} ${WERM_EMOJIS[type]} coin${count > 1 ? 's' : ''}`);
    }
  }

  const transferSummary = parts.join(', ');
  const baseMessage = `✅ Transferred ${transferSummary} to *${receiverUsername}*.`;

  return note ? `${baseMessage}\n> ${note}` : baseMessage;
}
