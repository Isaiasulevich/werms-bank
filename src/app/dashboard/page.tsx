"use client"

import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  ChartAreaInteractive,
  DataTable,
  SectionCards,
} from "@/components"
import { PoliciesPage } from "@/features/policies"
import { useSearchParams } from "next/navigation"
import { AuthGuard } from "@/lib/supabase"

import data from "./employees.json"

/**
 * Dashboard Content Component
 * 
 * Renders different content based on the current section parameter
 */
function DashboardContent() {
  const searchParams = useSearchParams()
  const section = searchParams.get('section')

  // Render policies content when section=policies
  if (section === 'policies') {
    return <PoliciesPage />
  }

  // Render employee balances content when section=employees  
  if (section === 'employees') {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Employee Balances</h1>
          <p className="text-muted-foreground">View and manage employee werm balances.</p>
        </div>
        <div className="px-4 lg:px-6">
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">Employee Balances coming soon...</p>
          </div>
        </div>
      </div>
    )
  }

  // Render audit logs content when section=audit
  if (section === 'audit') {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">Logs & Audit</h1>
          <p className="text-muted-foreground">Audit trail and system logs.</p>
        </div>
        <div className="px-4 lg:px-6">
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">Audit logs coming soon...</p>
          </div>
        </div>
      </div>
    )
  }

  // Default dashboard content
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardContent />
        </Suspense>
      </DashboardLayout>
    </AuthGuard>
  )
}
