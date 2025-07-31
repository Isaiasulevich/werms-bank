// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AuthCallback() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const processLogin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        console.error("Error fetching user:", error)
        return
      }

      // Send user info to backend to upsert into 'employees'
      await fetch("/api/ensure-employee", {
        method: "POST",
        body: JSON.stringify({ user }),
        headers: { "Content-Type": "application/json" },
      })

      router.push("/dashboard")
    }

    processLogin()
  }, [])

  return <p>Logging you in...</p>
}