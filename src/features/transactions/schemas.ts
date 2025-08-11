import { z } from 'zod'

export const WermTypeSchema = z.union([
  z.literal('gold'),
  z.literal('silver'),
  z.literal('bronze'),
])

export const TransactionLogSchema = z.object({
  id: z.string().uuid(),
  sender_id: z.string().uuid().nullable(),
  receiver_id: z.string().uuid().nullable(),
  sender_email: z.string().email(),
  receiver_username: z.string(),
  worm_type: WermTypeSchema,
  amount: z.number().int().positive(),
  value_aud: z.number().nonnegative(),
  description: z.string().nullable().optional(),
  policy_id: z.string().nullable().optional(),
  source: z.string().default('app'),
  status: z.string().default('completed'),
  created_at: z.string(),
})

export type TransactionLog = z.infer<typeof TransactionLogSchema>

// UI table schema for the dashboard table component
export const TransactionTableRowSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.union([
    z.object({ name: z.string(), type: z.literal('system') }),
    z.object({ name: z.string(), email: z.string(), slack_username: z.string(), role: z.string() }),
  ]),
  employee: z.object({
    name: z.string(),
    email: z.string(),
    slack_username: z.string(),
    department: z.string(),
    employee_id: z.string(),
  }).nullable(),
  timestamp: z.string(),
})

export type TransactionTableRow = z.infer<typeof TransactionTableRowSchema>


