"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconCoins,
  IconStack,
  IconChart,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
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

const data = {
  user: {
    name: "Isa",
    email: "isa@nakatomi.com",
    avatar: "/avatars/shadcn.jpg",
    slack_username: "@isa",
    role: "Operations Lead"
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Minting & Reserve",
      url: "#",
      icon: IconCoins,
    },
    {
      title: "Employee Balances",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Distribution",
      url: "#",
      icon: IconStack,
    },
    {
      title: "Monetary Policy",
      url: "#",
      icon: IconChart,
    },
  ],
  navClouds: [
    {
      title: "Coin Reconciliation",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Physical Deposits",
          url: "#",
        },
        {
          title: "Physical Returns",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Mint History",
          url: "#",
        },
        {
          title: "Distribution Log",
          url: "#",
        },
        {
          title: "Employee Holdings",
          url: "#",
        },
      ],
    },
    {
      title: "Adjustments",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Manual Overrides",
          url: "#",
        },
        {
          title: "Balance Corrections",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Policy Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help & Documentation",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Audit Trail",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Employee Directory",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Monetary Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Policy Documents",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-brand-500 to-brand-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">WC</span>
                </div>
                <span className="text-base font-semibold">Werms Central Bank</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
