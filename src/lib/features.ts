import fs from 'fs';
import path from 'path';
import { WermType, WERM_PRICES, WERM_TYPES } from './wermTypes';
import { Employee } from '@/features/employees';
import { SlackWermTransferInput } from '@/features/employees/types';
import { WERM_EMOJIS } from './wermTypes';

// TODO: TEST THIS FURTHER
function logWermCountByEmail(employees: any[], employeeEmail: string): void {
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

export function transferWerms(
  senderEmail: string,
  receiverUsername: string,
  wermsToTransfer: Partial<Record<WermType, number>>,
  note?: string
): void {
  const filePath = path.join(process.cwd(), 'src/data/employees.json');
  const raw = fs.readFileSync(filePath, 'utf-8');

  // We load it fresh every time
  const employeeData: Employee[] = JSON.parse(raw);

  const sender = employeeData.find(emp => emp.email === senderEmail);
  const receiver = employeeData.find(emp => emp.slack_username === receiverUsername);

  if (!sender || !receiver) {
    throw new Error('Invalid sender or receiver email provided')
  }

  for (const [key, amount] of Object.entries(wermsToTransfer)) {
    const type = key as WermType;
    const count = amount || 0;

    if ((sender.werm_balances[type] ?? 0) < count) {
      throw new Error(`Not enough ${type} werms to complete the transfer.`);
    }

    sender.werm_balances[type] -= count;
    receiver.werm_balances[type] = (receiver.werm_balances[type] ?? 0) + count;
    receiver.lifetime_earned[type] = (receiver.lifetime_earned[type] ?? 0) + count;
  }

  fs.writeFileSync(filePath, JSON.stringify(employeeData, null, 2));

  const dashboardPath = path.join(process.cwd(), 'src/app/dashboard/employees.json');
  fs.writeFileSync(dashboardPath, JSON.stringify(employeeData, null, 2));
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
