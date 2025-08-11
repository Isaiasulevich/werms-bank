import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { TransactionLogSchema, type TransactionLog } from './schemas'

interface UseTransactionLogsParams {
  limit?: number
  offset?: number
}

const ApiResponseSchema = z.object({
  data: z.array(TransactionLogSchema),
})

export function useTransactionLogs({ limit = 50, offset = 0 }: UseTransactionLogsParams = {}) {
  return useQuery({
    queryKey: ['transaction-logs', limit, offset],
    queryFn: async (): Promise<TransactionLog[]> => {
      const url = `/api/transactions?limit=${limit}&offset=${offset}`
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


