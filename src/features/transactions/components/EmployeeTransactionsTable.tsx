"use client"

import { z } from 'zod'
import { useMemo } from 'react'
import { DataTable, schema as DataTableSchema } from '@/components/data-table'
import { useTransactionLogs } from '@/features/transactions/hooks'
import { WERM_PRICES } from '@/lib/wermTypes'

interface EmployeeTransactionsTableProps {
  employeeId?: string
  slackUsername?: string
  limit?: number
}

export function EmployeeTransactionsTable({ employeeId, slackUsername, limit = 50 }: EmployeeTransactionsTableProps) {
  const { data, isLoading, isError } = useTransactionLogs({ limit })

  const rows = useMemo<z.infer<typeof DataTableSchema>[]>(() => {
    if (!data) return []
    const filtered = data.filter(t => {
      if (employeeId && (t.receiver_id === employeeId || t.sender_id === employeeId)) return true
      if (slackUsername && t.receiver_username === slackUsername) return true
      return !employeeId && !slackUsername
    })

    return filtered.map((t, idx) => {
      const header = t.werm_type === 'mixed'
        ? `Transfer to ${t.receiver_username}`
        : `${t.werm_type.toUpperCase()} ${t.amount} to ${t.receiver_username}`
      const total = t.total_werms || (t.amount * (WERM_PRICES as any)[t.werm_type] || 0)
      const target = t.werm_type === 'mixed'
        ? `${total} werms`
        : `${t.amount} ${t.werm_type}`
      return {
        id: idx + 1,
        header,
        type: 'Transfer',
        status: t.status ?? 'Completed',
        target,
        limit: t.source ?? 'app',
        reviewer: { name: 'System', type: 'system' as const },
        employee: null,
        timestamp: t.created_at,
      }
    })
  }, [data, employeeId, slackUsername])

  if (isLoading) return null
  if (isError) return null

  return <DataTable data={rows} />
}


