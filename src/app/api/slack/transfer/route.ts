// src/app/api/slack/transfer/route.ts

import { NextResponse } from 'next/server';

import { formatWermTransferMessage, parseWermInput, transferWerms } from '@/lib/features';
import { slackService } from '@/lib/services/slack-service';


export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const userId = params.get('user_id');
    const text = params.get('text');

    if (!userId || !text) {
      return NextResponse.json({ text: 'Missing user_id or command arguments.' });
    }

    let slackEmail: string;
    try {
      slackEmail = await slackService().getUserEmail(userId)
    } catch (error) {
      return NextResponse.json({ text: 'Could not resolve your Slack email.' });
    }


    const parsed = parseWermInput(text);
    if (!parsed || !parsed.username || !parsed.amounts) {
      return NextResponse.json({ text: 'Invalid command format.' });
    }

    try {
      await transferWerms(slackEmail, parsed.username, parsed.amounts, parsed.reason);
      const text = formatWermTransferMessage(parsed.amounts, parsed.username, parsed.reason)

      return NextResponse.json(slackService().returnResponse(text, 'in_channel'))
    } catch (err: unknown) {
      console.error("🚫 Transfer error:", err instanceof Error ? err.message : err);
      const text = `🚫 Transfer failed: ${err instanceof Error ? err.message : 'Unknown error'}`

      return NextResponse.json(slackService().returnResponse(text, 'ephemeral'))
    }

  } catch (err: unknown) {
    console.error("🔥 Unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json(slackService().returnResponse('Something went wrong during the transfer.'))
  }
}