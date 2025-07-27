"use client"

import * as React from "react"
import { AppSidebar } from "./app-sidebar"
import { SiteHeader } from "./site-header"
import { SidebarInset, SidebarProvider } from "./ui/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * Dashboard Layout Component
 * 
 * Provides consistent layout structure with sidebar and header across all dashboard pages.
 * This eliminates the need to duplicate layout code in each page component.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 