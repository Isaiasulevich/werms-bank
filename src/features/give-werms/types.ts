import type { Employee } from "../employees/types"
import type { Policy } from "../policies/types"

export interface WermDistribution {
  id: string
  employeeId: string
  policyId: string
  amount: number
  wermType: "gold" | "silver" | "platinum"
  createdAt: Date
  createdBy: string // Sarah's user ID
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
  wermType: "gold" | "silver" | "platinum"
  notes?: string
} 