import { WermType } from "@/lib/wermTypes"
import type { Employee } from "../employees/types"

export interface WermDistribution {
  id: string
  employeeId: string
  policyId: string
  amount: number
  wermType: WermType
  createdAt: Date
  createdBy: string
  notes?: string
}

export interface DistributionBatch {
  id: string
  policyId: string
  distributions: WermDistribution[]
  totalAmount: number
  createdAt: Date
  createdBy: string
  notes?: string
}

export interface DistributionFormData {
  policyId: string
  employees: {
    employeeId: string
    amount: number
    notes?: string
  }[]
  batchNotes?: string
}

export interface DistributionPreview {
  employee: Employee
  amount: number
  wermType: WermType
  notes?: string
} 