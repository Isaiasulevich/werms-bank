import 'dotenv/config';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const email = 'isaias@nakatomi.com';

async function fetchOnce(): Promise<number> {
  const start = Date.now();

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/employees?email=eq.${encodeURIComponent(email)}&select=werm_balances`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: 'application/json',
      },
    }
  );

  const data = await res.json();
  const duration = (Date.now() - start) / 1000;

  console.log(`✅ Response in ${duration.toFixed(3)}s:`, data);
  return duration;
}

async function main() {
  const runs = 10;
  const times: number[] = [];

  for (let i = 1; i <= runs; i++) {
    console.log(`\n⏱ Run ${i}...`);
    const time = await fetchOnce();
    times.push(time);
  }

  const total = times.reduce((sum, t) => sum + t, 0);
  const average = total / times.length;

  console.log(`\n📊 All runs: ${times.map(t => t.toFixed(3)).join(', ')} seconds`);
  console.log(`📈 Average time: ${average.toFixed(3)} seconds`);
}

main().catch(console.error);