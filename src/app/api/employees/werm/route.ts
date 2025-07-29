import { NextResponse } from 'next/server';
import { getWermCountByEmail } from '@/lib/employee';
import employeeData from '@/data/employees.json'; // statically imported JSON

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email param' }, { status: 400 });
  }

  const result = getWermCountByEmail(employeeData, email); // directly use imported JSON

  if (!result) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}