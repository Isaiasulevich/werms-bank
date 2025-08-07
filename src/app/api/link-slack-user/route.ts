import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_USER_OAUTH_TOKEN

  if (!SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_USER_OAUTH_TOKEN is missing in env")
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
  }

  const { user_id } = await req.json()

  if (!user_id) {
    return NextResponse.json({ error: "Missing Slack user_id" }, { status: 400 })
  }

  const userInfoRes = await fetch("https://slack.com/api/users.info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  const userInfo = await userInfoRes.json()

  if (!userInfo.ok) {
    console.error("Slack user info fetch failed:", userInfo)
    return NextResponse.json({ error: "Slack user lookup failed" }, { status: 500 })
  }

  // ✅ Console log only
  console.log("🧠 Slack user info:", userInfo.user)

  return NextResponse.json({ success: true })
}