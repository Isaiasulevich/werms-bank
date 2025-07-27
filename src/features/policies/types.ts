/**
 * Policy Types for Worm Bank Management System
 * 
 * Defines the structure and types for policy management including
 * policy creation, editing, and condition management.
 */

export interface PolicyCondition {
  id: string;
  type: 'attendance' | 'performance' | 'milestone' | 'custom';
  description: string;
  trigger: string;
  wormReward: {
    gold?: number;
    silver?: number;
    platinum?: number;
  };
  requiresApproval: boolean;
  isActive: boolean;
}

export interface Policy {
  id: string;
  title: string;
  description: string;
  category: 'distribution' | 'minting' | 'recognition' | 'compliance' | 'performance';
  status: 'active' | 'inactive' | 'draft';
  conditions: PolicyCondition[];
  createdBy: {
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  effectiveDate: string;
  expirationDate?: string;
  isSystemPolicy: boolean;
}

export type PolicyFormData = Omit<Policy, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

export interface PolicyStats {
  totalPolicies: number;
  activePolicies: number;
  triggeredToday: number;
  totalWormDistributed: number;
}

export type PolicyCategory = Policy['category'];
export type PolicyStatus = Policy['status'];
export type ConditionType = PolicyCondition['type']; 