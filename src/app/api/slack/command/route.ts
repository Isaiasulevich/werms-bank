import { NextResponse } from 'next/server';

const ngrokUrl = "https://d4f12a7c7755.ngrok-free.app"; // Update if needed

export async function POST(req: Request) {
  try {
    console.log("⚡️ Received Slack POST");

    // Validate content-type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/x-www-form-urlencoded')) {
      console.warn("❗ Unexpected content-type:", contentType);
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    const body = await req.text();
    console.log("📦 Raw body:", body);

    const params = new URLSearchParams(body);
    const userId = params.get('user_id');

    if (!userId) {
      console.error("❌ No user_id found in request");
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    // Get Slack user info
    const slackRes = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: {
        Authorization: `Bearer `,
      },
    });

    const slackData = await slackRes.json();
    console.log("🤖 Slack API response:", slackData);

    if (!slackData.ok) {
      return NextResponse.json({ error: slackData.error || 'Slack API request failed' }, { status: 500 });
    }

    const email = slackData.user?.profile?.email;
    if (!email) {
      console.warn("⚠️ No email in Slack user profile");
      return NextResponse.json({
        response_type: 'ephemeral',
        text: 'Could not resolve your Slack email. Please link your account.',
      });
    }

    // Call internal API to get enriched employee record
    const res = await fetch(`${ngrokUrl}/api/employees/werm?email=${email}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });

    const data = await res.json();
    console.log("🧑‍💻 Employee data:", data);

    if (data.error) {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: data.error,
      });
    }

    const totalWerms = data.werm_balances?.total_werms ?? null;
    const totalCoins = data.werm_balances?.total_coins ?? null;

    if (totalWerms === null || totalCoins === null) {
      return NextResponse.json({
        response_type: 'ephemeral',
        text: 'Could not compute your worm balance.',
      });
    }

    return NextResponse.json({
      response_type: 'ephemeral',
      text: `🐛 Hello ${data.name}! You currently have *${totalWerms} werms* (${totalCoins} coins).`,
    });

  } catch (err: any) {
    console.error("🔥 Unexpected error:", err?.message || err);
    console.error("📛 Full stack:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

