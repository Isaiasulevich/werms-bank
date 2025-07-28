import employeeData from '../app/dashboard/employees.json';

function logWermCountByEmail(employees: any[], employeeEmail: string): void {
  const employee = employees.find(emp => emp.email === employeeEmail);
  
  if (!employee) {
    console.log(`No employee found with email: ${employeeEmail}`);
    return;
  }
  
  console.log(`Employee: ${employee.name} (${employee.employee_id})`);
  console.log(`Total Werms: ${employee.werm_balances.total_werms}`);
}  

logWermCountByEmail(employeeData, "isa@nakatomi.com");