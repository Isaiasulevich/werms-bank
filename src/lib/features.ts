import fs from 'fs';
import path from 'path';
import employeeData from '../app/dashboard/employees.json';
import { WermType, WermBalances, WERM_PRICES } from './wermTypes';

/*
werm_balances: {
  gold: { count: number, total_value: number },
  silver: { count: number, total_value: number },
  bronze: { count: number, total_value: number },
  total_werms: number,
  total_value_aud: number
},
lifetime_earned: {
  gold: number,
  silver: number,
  bronze: number,
  total_werms: number,
  total_value_aud: number
}
*/

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

// TODO: EVENTUALLY, create this as a separate function to make api calls with
// which can be used to calculate totals and display. Type interfaces must
// be defined accordingly
function recalculateTotals(werm_balances: WermBalances) {
  let totalWerms = 0;
  let totalValue = 0;

  (['gold', 'silver', 'bronze'] as WermType[]).forEach(type => {
    const count = werm_balances[type]?.count || 0;
    const value = count * WERM_PRICES[type];
    werm_balances[type].total_value = parseFloat(value.toFixed(2));
    totalWerms += count;
    totalValue += value;
  });

  werm_balances.total_werms = totalWerms;
  werm_balances.total_value_aud = parseFloat(totalValue.toFixed(2));
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

    if (!sender.werm_balances[type] || sender.werm_balances[type].count < count) {
      console.log(`Not enough ${type} werms`);
      return;
    }

    /* WE ASSUME THAT THE DB ALREADY INITIALISES ZERO VALUES */
    // if (!receiver.werm_balances[type]) {
    //   receiver.werm_balances[type] = { count: 0, total_value: 0 };
    // }
    sender.werm_balances[type].count -= count;

    receiver.werm_balances[type].count += count;
    receiver.lifetime_earned[type] += count;
  }

  recalculateTotals(sender.werm_balances);
  recalculateTotals(receiver.werm_balances);

  const filePath = path.join(__dirname, '../app/dashboard/employees.json');
  fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));

  console.log(`Werms transferred successfully.`);

  if (note) {
    console.log("Note = ", note);
  }
  
}

// Simple test case for the function
transferWerms(employeeData, 'kislay@nakatomi.com', 'andy@nakatomi.com', 
  {gold: 1, bronze: 3}, "Test Transfer"
);


// TODO: SUGGESTION TO IMPLEMENT:
// "werm_balances": {
//       "gold": {
//         "count": 6,
//         "total_value": 60
//       },
//       "silver": {
//         "count": 1,
//         "total_value": 3
//       },
//       "bronze": {
//         "count": 11,
//         "total_value": 11
//       },
//       "total_werms": 18,
//       "total_value_aud": 74
//     },
//     "lifetime_earned": {
//       "gold": 3,
//       "silver": 15,
//       "bronze": 45,
//       "total_werms": 63,
//       "total_value_aud": 150
//     },

/* We may simplify the database to just keep track of the count of each type */
// Something like this would be practical to work with:

// "werm_balances": {
//   "gold": 6,
//   "silver": 1
//   "bronze": 11
// },
// "lifetime_earned": {
//   "gold": 3,
//   "silver": 15,
//   "bronze": 45
// },

// We may leave the 'total' calculations to the backend, and this info 
// can be fetched via API calls.
