/**
 * Employee Validation Schemas
 * 
 * Zod schemas for validating employee data throughout the application.
 * These schemas ensure data integrity and provide runtime type checking.
 */

import { z } from 'zod';

// Worm balance schema
export const wormBalanceSchema = z.object({
  count: z.number().min(0),
  total_werms: z.number().min(0),
});

// Worm balances schema
export const wormBalancesSchema = z.object({
  gold: wormBalanceSchema,
  silver: wormBalanceSchema,
  bronze: wormBalanceSchema,
  total_coins: z.number().min(0),
  total_werms: z.number().min(0),
});

// Lifetime earned schema
export const lifetimeEarnedSchema = z.object({
  gold: z.number().min(0),
  silver: z.number().min(0),
  bronze: z.number().min(0),
  total_coins: z.number().min(0),
  total_werms: z.number().min(0),
});

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z.string().min(1, "Emergency contact name is required"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number format"),
  relationship: z.string().min(1, "Relationship is required"),
});

// Employee schema
export const employeeSchema = z.object({
  id: z.string(),
  employee_id: z.string().regex(/^EMP-\d{4}-\d{4}$/, "Employee ID must be in format EMP-YYYY-NNNN"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  slack_username: z.string().min(1, "Slack username is required").regex(/^@[a-zA-Z0-9._-]+$/, "Slack username must start with @ and contain only letters, numbers, dots, underscores, and dashes"),
  department: z.enum(['Operations', 'Engineering', 'Product', 'Marketing', 'Design', 'Sales', 'Support', 'HR', 'Finance', 'Legal']),
  role: z.string().min(1, "Role is required").max(100, "Role must be less than 100 characters"),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Hire date must be in YYYY-MM-DD format"),
  manager_id: z.string().nullable(),
  permissions: z.array(z.enum([
    'admin',
    'approve_distributions',
    'approve_small_distributions',
    'view_all_balances',
    'view_team_balances',
    'view_own_balance',
    'manage_employees',
    'create_policies'
  ])).min(1, "At least one permission is required"),
  werm_balances: wormBalancesSchema,
  lifetime_earned: lifetimeEarnedSchema,
  avatar_url: z.string().url("Invalid avatar URL"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number format").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  emergency_contact: emergencyContactSchema.optional(),
});

// Form data schema (excludes calculated fields)
export const employeeFormSchema = z.object({
  employee_id: z.string().regex(/^EMP-\d{4}-\d{4}$/, "Employee ID must be in format EMP-YYYY-NNNN"),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  slack_username: z.string().min(1, "Slack username is required").regex(/^@[a-zA-Z0-9._-]+$/, "Slack username must start with @ and contain only letters, numbers, dots, underscores, and dashes"),
  department: z.enum(['Operations', 'Engineering', 'Product', 'Marketing', 'Design', 'Sales', 'Support', 'HR', 'Finance', 'Legal']),
  role: z.string().min(1, "Role is required").max(100, "Role must be less than 100 characters"),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Hire date must be in YYYY-MM-DD format"),
  manager_id: z.string().nullable(),
  permissions: z.array(z.enum([
    'admin',
    'approve_distributions',
    'approve_small_distributions',
    'view_all_balances',
    'view_team_balances',
    'view_own_balance',
    'manage_employees',
    'create_policies'
  ])).min(1, "At least one permission is required"),
  avatar_url: z.string().url("Invalid avatar URL").optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number format").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  emergency_contact: emergencyContactSchema.optional(),
}).refine((data) => {
  // Custom validation: manager cannot be themselves
  return data.manager_id !== data.employee_id;
}, {
  message: "Employee cannot be their own manager",
  path: ["manager_id"],
});

// Employee filters schema
export const employeeFiltersSchema = z.object({
  department: z.enum(['Operations', 'Engineering', 'Product', 'Marketing', 'Design', 'Sales', 'Support', 'HR', 'Finance', 'Legal']).optional(),
  manager_id: z.string().optional(),
  search: z.string().optional(),
  hasPermission: z.enum([
    'admin',
    'approve_distributions',
    'approve_small_distributions',
    'view_all_balances',
    'view_team_balances',
    'view_own_balance',
    'manage_employees',
    'create_policies'
  ]).optional(),
});

// Employee sort schema
export const employeeSortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
});

// Worm transaction schema
export const wormTransactionSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  type: z.enum(['earn', 'spend', 'transfer', 'adjustment']),
  worm_type: z.enum(['gold', 'silver', 'bronze']),
  amount: z.number(),
  value_aud: z.number(),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  approved_by: z.string().optional(),
  created_at: z.string(),
  policy_id: z.string().optional(),
});

// Quick add employee schema (minimal required fields)
export const quickAddEmployeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  department: z.enum(['Operations', 'Engineering', 'Product', 'Marketing', 'Design', 'Sales', 'Support', 'HR', 'Finance', 'Legal']),
  role: z.string().min(1, "Role is required").max(100, "Role must be less than 100 characters"),
  manager_id: z.string().nullable(),
});

// Type exports
export type EmployeeForm = z.infer<typeof employeeFormSchema>;
export type EmployeeFilters = z.infer<typeof employeeFiltersSchema>;
export type EmployeeSort = z.infer<typeof employeeSortSchema>;
export type WormTransaction = z.infer<typeof wormTransactionSchema>;
export type QuickAddEmployee = z.infer<typeof quickAddEmployeeSchema>; 