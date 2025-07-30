// src/app/api/slack/transfer/route.ts
import { NextResponse } from 'next/server';
import { WermType } from '@/lib/wermTypes';
import { transferWerms } from '@/lib/features';

export async function POST(req: Request) {
  try {
    console.log("⚡️ Received Slack Transfer POST");

    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/x-www-form-urlencoded')) {
      console.warn("❗ Unexpected content-type:", contentType);
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    const body = await req.text();
    console.log("📦 Raw body:", body);

    const params = new URLSearchParams(body);
    const userId = params.get('user_id');
    const text = params.get('text'); // expects: [username] [amount] [optional note]

    if (!userId || !text) {
      return NextResponse.json({ text: 'Missing user_id or command arguments.' });
    }

    const slackRes = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: { Authorization: `Bearer ` }, 
    });

    const slackData = await slackRes.json();
    console.log("🤖 Slack API response:", slackData);

    if (!slackData.ok) {
      return NextResponse.json({ text: 'Could not resolve your Slack identity.' });
    }

    const senderEmail = slackData.user?.profile?.email;
    if (!senderEmail) {
      return NextResponse.json({ text: 'Could not resolve your Slack email. Please link your account.' });
    }

    const [receiverUsernameRaw, amountRaw, ...noteParts] = text.split(' ');
    const receiverUsername = receiverUsernameRaw?.trim();
    const amount = parseInt(amountRaw);
    const note = noteParts.join(' ').trim();

    if (!receiverUsername || isNaN(amount) || amount <= 0) {
      return NextResponse.json({
        text: 'Invalid command format. Use `/transfer [username] [amount] [optional note]`.',
      });
    }

    // Bronze only for now
    const wermsToTransfer: Partial<Record<WermType, number>> = {
      bronze: amount,
    };

    try {
      console.log(transferWerms(senderEmail, receiverUsername, wermsToTransfer, note));

      return NextResponse.json({
        response_type: 'in_channel',
        text: `✅ Transferred ${amount} 🥉 werms from to *${receiverUsername}*.` +
              (note ? `\n> ${note}` : ''),
      });
    } catch (error: any) {
      console.error("🚫 Transfer failed:", error.message);
      return NextResponse.json({
        response_type: 'ephemeral',
        text: `🚫 Transfer failed: ${error.message}`,
      });
    }
  } catch (err: any) {
    console.error("🔥 Unexpected error:", err);
    return NextResponse.json({ text: 'Something went wrong during the transfer.' });
  }
}