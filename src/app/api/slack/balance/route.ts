import { NextResponse } from 'next/server';
import 'dotenv/config';
import { computeWormBalances } from '@/lib/wermTypes';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/*
- Handles Slack /balance command via user_name
- Looks up Supabase by slack_username
- Computes balance breakdown with computeWormBalances()
- Returns ephemeral response within Slack's 3s timeout window
*/
export async function POST(req: Request) {
  const T0 = Date.now();
  try {
    const t1 = Date.now();
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/x-www-form-urlencoded')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    const t2 = Date.now();
    const body = await req.text();
    const t3 = Date.now();
    console.log("⏱ Content-Type check:", t2 - t1, "ms");
    console.log("⏱ Body parse:", t3 - t2, "ms");

    const t4 = Date.now();
    const params = new URLSearchParams(body);
    const slackUsername = '@' + (params.get('user_name') || '').trim();
    const t5 = Date.now();
    console.log("⏱ Params parse:", t5 - t4, "ms");

    if (!slackUsername || slackUsername === '@') {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: 'Missing Slack username.',
      });
    }

    const t6 = Date.now();
    const supabaseRes = await fetch(
      `${SUPABASE_URL}/rest/v1/employees?slack_username=eq.${encodeURIComponent(slackUsername)}&select=werm_balances`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Accept: 'application/json',
        },
      }
    );
    const t7 = Date.now();
    console.log("⏱ Supabase fetch:", t7 - t6, "ms");

    const data = await supabaseRes.json();
    const t8 = Date.now();
    console.log("⏱ Supabase JSON parse:", t8 - t7, "ms");

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: `Could not find a record for Slack user ${slackUsername}`,
      });
    }

    const t9 = Date.now();
    const enriched = computeWormBalances(data[0].werm_balances);
    const t10 = Date.now();
    console.log("⏱ computeWormBalances:", t10 - t9, "ms");

    const t11 = Date.now();
    const response = NextResponse.json({
      response_type: 'ephemeral',
      text: `You currently have *${enriched.total_werms} werms* (${enriched.gold} 🥇, ${enriched.silver} 🥈, ${enriched.bronze} 🥉).`,
    });
    const t12 = Date.now();
    console.log("⏱ Response build:", t12 - t11, "ms");

    console.log("⏱ TOTAL TIME:", Date.now() - T0, "ms");

    return response;

  } catch (err: any) {
    console.error('🔥 Unexpected error:', err?.message || err);
    console.log("⏱ TOTAL TIME (with error):", Date.now() - T0, "ms");
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Internal server error. Please try again later.',
    });
  }
}