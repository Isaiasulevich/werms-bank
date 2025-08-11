"use client"

import { z } from 'zod'
import { useMemo } from 'react'
import { DataTable, schema as DataTableSchema } from '@/components/data-table'
import { WERM_PRICES } from '@/lib/wermTypes'
import { useTransactionLogs } from '@/features/transactions/hooks'

export function TransactionsTable() {
  const { data, isLoading, isError } = useTransactionLogs({ limit: 50 })

  const rows = useMemo<z.infer<typeof DataTableSchema>[]>(() => {
    if (!data) return []
    return data.map((t, idx) => {
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
  }, [data])

  if (isLoading) return null
  if (isError) return null

  return <DataTable data={rows} />
}


