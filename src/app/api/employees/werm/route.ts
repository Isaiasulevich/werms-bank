// src/app/api/employees/werm
import { NextResponse } from 'next/server';
import { getWermCountByEmail } from '@/lib/employee';
import { Department, Employee } from '@/features/employees';
import rawEmployeeData from '@/data/employees.json';

function normalizeEmployeeData(data: any[]): Employee[] {
  return data.map((emp) => ({
    ...emp,
    department: emp.department as Department,
    status: emp.status ?? 'active', // fallback if needed
  }));
}

const employeeData: Employee[] = normalizeEmployeeData(rawEmployeeData);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email param' }, { status: 400 });
  }

  const result = getWermCountByEmail(employeeData, email); // directly use imported JSON

  console.log('✅ Outgoing employee payload:', JSON.stringify(result, null, 2));

  if (!result) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}