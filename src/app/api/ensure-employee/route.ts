import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Must be service role
)


export async function POST(req: Request) {
  const { user } = await req.json()

  const email = user.email
  const name = user.user_metadata?.full_name || email?.split("@")[0]
  const slack_username = "@" + (user.user_metadata?.user_name || name)
  const avatar_url = user.user_metadata?.avatar_url || ""
  const id = `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`

  // TODO: Enrich with Slack API if needed

  const { error } = await supabase
    .from("employees")
    .upsert(
      {
        id,
        name,
        email,
        slack_username,
        department: null,
        role: null,
        hire_date: new Date().toISOString().split("T")[0],
        manager_id: null,
        permissions: ['view_own_balance'],
        werm_balances: { gold: 0, silver: 0, bronze: 0 },
        lifetime_earned: { gold: 0, silver: 0, bronze: 0 },
        avatar_url,
      },
      { onConflict: "email" } // Avoid duplicate emails
    )

  if (error) {
    console.error("Failed to upsert employee:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}