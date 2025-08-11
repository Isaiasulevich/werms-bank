"use client"

import { z } from 'zod'
import { useMemo } from 'react'
import { DataTable, schema as DataTableSchema } from '@/components/data-table'
import { useTransactionLogs } from '@/features/transactions/hooks'

export function TransactionsTable() {
  const { data, isLoading, isError } = useTransactionLogs({ limit: 50 })

  const rows = useMemo<z.infer<typeof DataTableSchema>[]>(() => {
    if (!data) return []
    return data.map((t, idx) => ({
      id: idx + 1,
      header: `${t.worm_type.toUpperCase()} ${t.amount} to ${t.receiver_username}`,
      type: 'Transfer',
      status: t.status ?? 'Completed',
      target: `${t.amount} ${t.worm_type}`,
      limit: t.description ?? 'N/A',
      reviewer: { name: 'System', type: 'system' as const },
      employee: null,
      timestamp: t.created_at,
    }))
  }, [data])

  if (isLoading) return null
  if (isError) return null

  return <DataTable data={rows} />
}


