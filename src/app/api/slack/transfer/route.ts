// src/app/api/slack/transfer/route.ts
import 'dotenv/config'
import { NextResponse } from 'next/server';
import { WermType } from '@/lib/wermTypes';
import { formatWermTransferMessage, parseWermInput, transferWerms } from '@/lib/features';

const SLACK_BOT_USER_OAUTH_TOKEN = process.env.SLACK_BOT_USER_OAUTH_TOKEN

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const userId = params.get('user_id');
    const text = params.get('text');

    if (!userId || !text) {
      return NextResponse.json({ text: 'Missing user_id or command arguments.' });
    }

    const slackRes = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: { Authorization: `Bearer ${SLACK_BOT_USER_OAUTH_TOKEN}` },
    });

    const slackData = await slackRes.json();
    const senderEmail = slackData.user?.profile?.email;

    if (!slackData.ok || !senderEmail) {
      return NextResponse.json({ text: 'Could not resolve your Slack email.' });
    }

    const parsed = parseWermInput(text);
    if (!parsed || !parsed.username || !parsed.amounts) {
      return NextResponse.json({ text: 'Invalid command format.' });
    }

    try {
      await transferWerms(senderEmail, parsed.username, parsed.amounts, parsed.reason);

      return NextResponse.json({
        response_type: 'in_channel',
        text: formatWermTransferMessage(parsed.amounts, parsed.username, parsed.reason),
      });
    } catch (err: any) {
      console.error("🚫 Transfer error:", err.message);
      return NextResponse.json({
        response_type: 'ephemeral',
        text: `🚫 Transfer failed: ${err.message}`,
      });
    }

  } catch (err: any) {
    console.error("🔥 Unexpected error:", err.message);
    return NextResponse.json({ text: 'Something went wrong during the transfer.' });
  }
}