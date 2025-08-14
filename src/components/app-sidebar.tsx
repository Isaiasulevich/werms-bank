"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconDashboard,
  IconSettings,
  IconUsers,
  IconFileDescription,
  IconShield,
} from "@tabler/icons-react"


import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth, createClient } from "@/lib/supabase"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Employees",
      url: "/employees",
      icon: IconUsers,
    },
    {
      title: "Policies",
      url: "/policies",
      icon: IconShield,
    },
    {
      title: "Logs & Audit",
      url: "/dashboard?section=audit",
      icon: IconFileDescription,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
 
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  /**
   * Purpose
   * - Render the application sidebar with navigation and the signed-in user's identity.
   * - Resolve the display user from two sources:
   *   1) Auth session (fast, available immediately)
   *   2) `employees` table (authoritative profile: role, Slack handle, avatar)
   *
   * Approach
   * - Initialize state from auth metadata/email so UI has immediate values.
   * - Use an effect to fetch the matching employee by email and merge into state when it arrives.
   * - This ensures a quick paint using auth and then enhances with employees data without flicker.
   *
   * Notes
   * - The effect depends on `user` (not the derived state) to avoid stale closures and linter noise.
   * - An `isMounted` flag prevents setting state after unmount during async work.
   * - Future alternative: extract into a dedicated hook and/or use React Query for caching and retries.
   */
  const { user } = useAuth()

  // State: sidebar-ready user object consumed by `NavUser`
  const [sidebarUser, setSidebarUser] = React.useState({
    name: user?.user_metadata?.name || user?.email?.split("@")[0] || "",
    email: user?.email || "",
    avatar:
      (typeof user?.user_metadata?.avatar_url === "string" && user.user_metadata.avatar_url) ||
      (typeof user?.user_metadata?.picture === "string" && user.user_metadata.picture) ||
      "/nakawermi_logo.png",
    slack_username: undefined as string | undefined,
    role: undefined as string | undefined,
  })

  // Effect: hydrate user state with authoritative details from `employees`
  // - Guarded by `user?.email` availability
  // - Merges server data with auth-derived defaults to avoid UI flicker
  React.useEffect(() => {
    let isMounted = true
    async function loadEmployee() {
      if (!user?.email) return
      const supabase = createClient()
      const { data: employee } = await supabase
        .from("employees")
        .select("name,email,role,avatar_url,slack_username")
        .eq("email", user.email)
        .single()

      if (!isMounted) return

      const defaultName =
        (typeof user.user_metadata?.name === "string" && (user.user_metadata.name as string)) ||
        user.email.split("@")[0]
      const defaultAvatar =
        (typeof user.user_metadata?.avatar_url === "string" && (user.user_metadata.avatar_url as string)) ||
        (typeof user.user_metadata?.picture === "string" && (user.user_metadata.picture as string)) ||
        "/nakawermi_logo.png"

      setSidebarUser(prev => ({
        name: employee?.name || prev.name || defaultName,
        email: employee?.email || user.email || prev.email,
        avatar: employee?.avatar_url || prev.avatar || defaultAvatar,
        slack_username: employee?.slack_username || prev.slack_username,
        role: employee?.role || prev.role,
      }))
    }
    loadEmployee()
    return () => {
      isMounted = false
    }
  }, [user])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/nakawermi_logo.png"
                  alt="Werms Bank Logo"
                  className="w-8 h-8 rounded-md object-cover"
                  width={32}
                  height={32}
                />
                <span className="text-base font-semibold">Werms Bank</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation groups */}
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* User identity (name, role/email, avatar, slack) */}
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

