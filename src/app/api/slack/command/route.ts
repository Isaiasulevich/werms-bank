
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const params = new URLSearchParams(body);
        const userId = params.get('user_id');

        if (!userId) {
            console.error("No user_id found");
            return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
        }

        const slackRes = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
            headers: {
                Authorization: `Bearer (replace key))`,
            },
        });

        const slackData = await slackRes.json();
        console.log("Slack API response:", slackData);

        if (!slackData.ok) {
            return NextResponse.json({ error: slackData.error || 'Slack API request failed' }, { status: 500 });
        }

        const email = slackData.user?.profile?.email;
        if (!email) {
            console.warn("No email in user profile");
            return NextResponse.json({ text: 'Could not resolve your Slack email. Please link your account.' });
        }

        const res = await fetch(
        `https://12df510977d4.ngrok-free.app/api/employees/werm?email=${email}`,
        {
            headers: { 'ngrok-skip-browser-warning': 'true' },
        }
        );

        const data = await res.json();
        console.log("Employee data:", data);

        if (data.error) {
            return NextResponse.json({ text: data.error });
        }

        return NextResponse.json({
            response_type: 'ephemeral',
            text: `Your balance is ${data.total_werms} werms 🪱`,
        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
