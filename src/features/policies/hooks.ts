/**
 * Policy Management Hooks
 * 
 * Custom React hooks for managing policy state, CRUD operations,
 * and data fetching. Uses React Query for efficient caching and
 * state synchronization.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Policy, PolicyFormData, PolicyStats } from './types';

// Mock data for development - in real app this would come from API
const mockPolicies: Policy[] = [
  {
    id: 'pol-001',
    title: 'Daily Attendance Rewards',
    description: 'Automatically reward employees for consistent daily attendance',
    category: 'recognition',
    status: 'active',
    conditions: [
      {
        id: 'cond-001',
        type: 'attendance',
        description: 'Employee arrives on time (before 9:00 AM)',
        trigger: 'Clock-in before 9:00 AM',
        wormReward: { bronze: 1 },
        requiresApproval: false,
        isActive: true,
      },
      {
        id: 'cond-002',
        type: 'attendance',
        description: 'Perfect weekly attendance',
        trigger: 'No missed days in a week',
        wormReward: { silver: 5 },
        requiresApproval: true,
        isActive: true,
      }
    ],
    createdBy: {
      name: 'Isa',
      email: 'isa@nakatomi.com',
      role: 'Operations Lead'
    },
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    effectiveDate: '2024-12-01T00:00:00Z',
    isSystemPolicy: false,
  },
  {
    id: 'pol-002',
    title: 'Performance Milestone Rewards',
    description: 'Reward employees for achieving performance milestones',
    category: 'performance',
    status: 'active',
    conditions: [
      {
        id: 'cond-003',
        type: 'performance',
        description: 'Complete project ahead of schedule',
        trigger: 'Project completion 2+ days early',
        wormReward: { gold: 3 },
        requiresApproval: true,
        isActive: true,
      }
    ],
    createdBy: {
      name: 'Matt',
      email: 'matt@nakatomi.com',
      role: 'Product Director'
    },
    createdAt: '2024-11-15T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
    effectiveDate: '2024-12-01T00:00:00Z',
    isSystemPolicy: false,
  },
  {
    id: 'pol-003',
    title: 'Daily Worm Minting',
    description: 'Automated daily minting of worms to maintain bank reserves',
    category: 'minting',
    status: 'active',
    conditions: [
      {
        id: 'cond-004',
        type: 'custom',
        description: 'Daily automated mint at 9:00 AM',
        trigger: 'Scheduled daily at 9:00 AM',
        wormReward: { gold: 15, silver: 47, bronze: 94 },
        requiresApproval: false,
        isActive: true,
      }
    ],
    createdBy: {
      name: 'Bank System',
      email: 'system@nakatomi.com',
      role: 'System'
    },
    createdAt: '2024-10-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    effectiveDate: '2024-10-01T00:00:00Z',
    isSystemPolicy: true,
  }
];

const mockStats: PolicyStats = {
  totalPolicies: 3,
  activePolicies: 3,
  triggeredToday: 5,
  totalWormDistributed: 234,
};

/**
 * Hook for managing policy list and operations
 */
export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // initial fetch
  useEffect(() => {
    let mounted = true
    async function fetchPolicies() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/policies')
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Failed to load policies')
        if (mounted) setPolicies(json.data ?? [])
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load policies')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    fetchPolicies()
    return () => { mounted = false }
  }, [])

  const createPolicy = useCallback(async (policyData: PolicyFormData): Promise<Policy> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to create policy')
      const created: Policy = json.data
      setPolicies(prev => [created, ...prev])
      return created
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create policy'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, []);

  const updatePolicy = useCallback(async (id: string, policyData: Partial<PolicyFormData>): Promise<Policy> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, update is a client-only optimistic update until we add a dedicated API
      const existing = policies.find(p => p.id === id)
      if (!existing) throw new Error('Policy not found')
      const updated: Policy = { ...existing, ...policyData, updatedAt: new Date().toISOString() }
      setPolicies(prev => prev.map(p => (p.id === id ? updated : p)))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update policy'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [policies]);

  const deletePolicy = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/policies/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error || 'Failed to delete policy')
      }
      setPolicies(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete policy'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, []);

  return {
    policies,
    isLoading,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
}

/**
 * Hook for getting policy statistics
 */
export function usePolicyStats() {
  const [stats, setStats] = useState<PolicyStats>(mockStats);
  const [isLoading, setIsLoading] = useState(false);

  return {
    stats,
    isLoading,
  };
}

/**
 * Hook for managing policy form state
 */
export function usePolicyForm(initialPolicy?: Policy) {
  const [formData, setFormData] = useState<PolicyFormData>(() => {
    if (initialPolicy) {
      const { id, createdAt, updatedAt, createdBy, ...rest } = initialPolicy;
      return rest;
    }
    
    return {
      title: '',
      description: '',
      category: 'recognition' as const,
      status: 'draft' as const,
      conditions: [],
      effectiveDate: new Date().toISOString().split('T')[0],
      isSystemPolicy: false,
    };
  });

  const updateFormData = useCallback((updates: Partial<PolicyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      category: 'recognition',
      status: 'draft',
      conditions: [],
      effectiveDate: new Date().toISOString().split('T')[0],
      isSystemPolicy: false,
    });
  }, []);

  return {
    formData,
    updateFormData,
    resetForm,
    setFormData,
  };
} 