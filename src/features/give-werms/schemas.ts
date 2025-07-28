import { z } from "zod"

export const wermDistributionSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  policyId: z.string().uuid(),
  amount: z.number().min(1, "Amount must be at least 1"),
  wermType: z.enum(["gold", "silver", "platinum"]),
  createdAt: z.date(),
  createdBy: z.string().uuid(),
  notes: z.string().optional(),
})

export const distributionBatchSchema = z.object({
  id: z.string().uuid(),
  policyId: z.string().uuid(),
  distributions: z.array(wermDistributionSchema),
  totalAmount: z.number().min(1),
  createdAt: z.date(),
  createdBy: z.string().uuid(),
  notes: z.string().optional(),
})

export const distributionFormDataSchema = z.object({
  policyId: z.string().uuid("Please select a policy"),
  employees: z.array(z.object({
    employeeId: z.string().uuid(),
    amount: z.number().min(1, "Amount must be at least 1"),
    notes: z.string().optional(),
  })).min(1, "Please select at least one employee"),
  batchNotes: z.string().optional(),
})

export type WermDistributionInput = z.infer<typeof wermDistributionSchema>
export type DistributionBatchInput = z.infer<typeof distributionBatchSchema>
export type DistributionFormDataInput = z.infer<typeof distributionFormDataSchema> 