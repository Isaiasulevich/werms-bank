import fs from 'fs';
import path from 'path';
import { WermType, WERM_PRICES } from './wermTypes';
import { Employee } from '@/features/employees';

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

  // We load it frech every time
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


// Simple test case for the function
// transferWerms(employeeData, 'kislay@nakatomi.com', 'isaias@nakatomi.com', 
//   {silver: 2, bronze: 2}, "Test Transfer"
// );

// transferWerms('isaias@nakatomi.com', 'kislay@nakatomi.com', 
//   {silver: 2, bronze: 2}, "Test Transfer"
// );