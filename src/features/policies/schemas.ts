/**
 * Policy Validation Schemas
 * 
 * Zod schemas for validating policy data throughout the application.
 * These schemas ensure data integrity and provide runtime type checking.
 */

import { z } from 'zod';

// Worm reward schema for conditions
export const wormRewardSchema = z.object({
  gold: z.number().min(0).optional(),
  silver: z.number().min(0).optional(),
  bronze: z.number().min(0).optional(),
}).refine(
  (data) => (data.gold ?? 0) + (data.silver ?? 0) + (data.bronze ?? 0) > 0,
  { message: "At least one worm type must have a value greater than 0" }
);

// Policy condition schema
export const policyConditionSchema = z.object({
  id: z.string(),
  type: z.enum(['attendance', 'performance', 'milestone', 'custom']),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  trigger: z.string().min(1, "Trigger condition is required").max(200, "Trigger must be less than 200 characters"),
  wormReward: wormRewardSchema,
  requiresApproval: z.boolean(),
  isActive: z.boolean(),
});

// Policy schema
export const policySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  category: z.enum(['distribution', 'minting', 'recognition', 'compliance']),
  status: z.enum(['active', 'inactive', 'draft']),
  conditions: z.array(policyConditionSchema).min(1, "At least one condition is required").max(4, "Maximum 4 conditions allowed"),
  createdBy: z.object({
    name: z.string(),
    email: z.string().email(),
    role: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  effectiveDate: z.string(),
  expirationDate: z.string().optional(),
  isSystemPolicy: z.boolean(),
});

// Form data schema (excludes generated fields)
export const policyFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  category: z.enum(['distribution', 'minting', 'recognition', 'compliance']),
  status: z.enum(['active', 'inactive', 'draft']),
  conditions: z.array(policyConditionSchema).min(1, "At least one condition is required").max(4, "Maximum 4 conditions allowed"),
  effectiveDate: z.string(),
  expirationDate: z.string().optional(),
  isSystemPolicy: z.boolean(),
});

// Single condition form schema
export const conditionFormSchema = z.object({
  type: z.enum(['attendance', 'performance', 'milestone', 'custom']),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  trigger: z.string().min(1, "Trigger condition is required").max(200, "Trigger must be less than 200 characters"),
  wormReward: wormRewardSchema,
  requiresApproval: z.boolean(),
  isActive: z.boolean(),
});

// Type exports
export type PolicyConditionForm = z.infer<typeof conditionFormSchema>;
export type PolicyForm = z.infer<typeof policyFormSchema>;
export type WormReward = z.infer<typeof wormRewardSchema>; 