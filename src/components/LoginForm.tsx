"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui"

export function LoginForm() {
  const supabase = createClient()
  const router = useRouter()

  const handleSlackLogin = async () => {
    console.log("[Slack Login] Attempting to log in with Slack")

    try {
      console.log("[Slack Login] Calling supabase.auth.signInWithOAuth with:")
      console.log({
        provider: "slack",
        redirectTo: `${location.origin}/auth/callback`,
      })

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "slack",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("[Slack Login] Supabase error object:", error)
        alert(`Slack login failed: ${error.message}`)
      } else {
        console.log("[Slack Login] Got redirect response from Supabase OAuth call:", data)
        // No redirect here because Supabase will automatically handle redirect.
      }
    } catch (err) {
      console.error("[Slack Login] Unexpected exception:", err)
      alert("Unexpected error during Slack login")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login with Slack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value="you@example.com" disabled />
            </div>
            <Button onClick={handleSlackLogin} className="w-full">
              Login with Slack
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}