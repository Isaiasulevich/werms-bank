// lib/employee.ts

export type Employee = {
    name: string;
    email: string;
    employee_id: string;
    werm_balances: {
        total_werms: number;
    };
};

export function getWermCountByEmail(employees: Employee[], email: string) {
    const employee = employees.find(emp => emp.email === email);

    if (!employee) {
        return null;
    }

    return {
        name: employee.name,
        employee_id: employee.employee_id,
        total_werms: employee.werm_balances.total_werms,
    };
}  