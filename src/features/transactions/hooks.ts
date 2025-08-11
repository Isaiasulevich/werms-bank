import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { TransactionLogSchema, type TransactionLog } from './schemas'

interface UseTransactionLogsParams {
  limit?: number
  offset?: number
  employeeId?: string
  slackUsername?: string
}

const ApiResponseSchema = z.object({
  data: z.array(TransactionLogSchema),
})

export function useTransactionLogs({ limit = 50, offset = 0, employeeId, slackUsername }: UseTransactionLogsParams = {}) {
  return useQuery({
    queryKey: ['transaction-logs', limit, offset, employeeId, slackUsername],
    queryFn: async (): Promise<TransactionLog[]> => {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
      if (employeeId) params.set('employeeId', employeeId)
      if (slackUsername) params.set('slackUsername', slackUsername)
      const url = `/api/transactions?${params.toString()}`
      const res = await fetch(url)
      if (!res.ok) {
        throw Object.assign(new Error('Failed to fetch transaction logs'), { status: res.status })
      }
      const json = await res.json()
      const parsed = ApiResponseSchema.safeParse(json)
      if (!parsed.success) {
        throw new Error('Invalid transaction logs response')
      }
      return parsed.data.data
    },
  })
}


