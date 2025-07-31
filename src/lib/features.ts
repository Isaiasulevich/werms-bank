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
  
  console.log(`Employee: ${employee.name} (${employee.employee_id})`);
  console.log(`Total Werms: ${employee.werm_balances.total_werms}`);
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
