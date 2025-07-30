import fs from 'fs';
import path from 'path';
import employeeData from '../app/dashboard/employees.json';
import { WermType, WERM_PRICES } from './wermTypes';

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


// TODO: Document function
function transferWerms(
  employees: any[],
  senderEmail: string,
  receiverEmail: string,
  wermsToTransfer: Partial<Record<WermType, number>>,
  note?: string
): void {
  const sender = employees.find(emp => emp.email === senderEmail);
  const receiver = employees.find(emp => emp.email === receiverEmail);

  if (!sender || !receiver) {
    console.log('Invalid email/s provided');
    return;
  }

  for (const [key, amount] of Object.entries(wermsToTransfer)) {
    const type = key as WermType;
    const count = amount || 0;
  
    if (sender.werm_balances[type] < count) {
      console.log(`Not enough ${type} werms`);
      return;
    }
  
    sender.werm_balances[type] -= count;
    receiver.werm_balances[type] += count;
    receiver.lifetime_earned[type] += count;
  }

  const filePath = path.join(__dirname, '../app/dashboard/employees.json');
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));

  // TODO: Add this in the transfer logs


  // TODO: REMOVE DEBUGGING STATEMENTS
  // console.log(`Werms transferred successfully.`);

  // if (note) {
  //   console.log("Note = ", note);
  // }
}

// Simple test case for the function
transferWerms(employeeData, 'ben@nakatomi.com', 'andy@nakatomi.com', 
  {gold: 1, silver: 2, bronze: 6}, "Test Transfer"
);