/**
 * Employee Management Hooks
 * 
 * Custom hooks for managing employee data, including CRUD operations,
 * filtering, sorting, and form management.
 */

'use client';
import { createClient } from '@/lib/supabase/client';
import { useState, useCallback, useMemo } from 'react';
import { Employee, EmployeeFormData, EmployeeStats, EmployeeFilters, EmployeeSort } from './types';
import { computeWormBalances } from '@/lib/wermTypes'; 
import { useEffect } from 'react';

/**
 * Generate next employee ID
 */
function generateEmployeeId(existingIds: string[]): string {
  const year = new Date().getFullYear();
  const numericIds = existingIds
    .filter(id => id.startsWith(`EMP-${year}`))
    .map(id => parseInt(id.split('-')[2]))
    .sort((a, b) => b - a);

  const nextNumber = numericIds.length > 0 ? numericIds[0] + 1 : 1;
  return `EMP-${year}-${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Hook for managing employee list and operations
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        setError(error.message);
      } else {
        setEmployees(data || []);
      }
      setIsLoading(false);
    }

    fetchEmployees();
  }, []);

  const createEmployee = useCallback(async (employeeData: EmployeeFormData): Promise<Employee> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const existingIds = employees.map(emp => emp.employee_id);
      const newEmployee: Employee = {
        ...employeeData,
        id: `emp-${Date.now()}`,
        employee_id: employeeData.employee_id || generateEmployeeId(existingIds),
        werm_balances: { gold: 0, silver: 0, bronze: 0 },
        lifetime_earned: { gold: 0, silver: 0, bronze: 0 },
        avatar_url: employeeData.avatar_url || `/avatars/${employeeData.name.toLowerCase().replace(/\s+/g, '')}.jpg`,
      };

      const { error: insertError } = await supabase.from('employees').insert([newEmployee]);
      if (insertError) throw insertError;

      setEmployees(prev => [newEmployee, ...prev]);
      return newEmployee;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [employees]);

  const updateEmployee = useCallback(async (id: string, employeeData: Partial<EmployeeFormData>): Promise<Employee> => {
    setIsLoading(true);
    setError(null);

    try {
      const existingEmployee = employees.find(emp => emp.id === id);
      if (!existingEmployee) throw new Error('Employee not found');

      const updatedEmployee = { ...existingEmployee, ...employeeData };
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id);

      if (updateError) throw updateError;

      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [employees]);

  const deleteEmployee = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const hasDirectReports = employees.some(emp => emp.manager_id === id);
      if (hasDirectReports) {
        throw new Error('Cannot delete employee who manages other employees. Please reassign their direct reports first.');
      }

      const { error: deleteError } = await supabase.from('employees').delete().eq('id', id);
      if (deleteError) throw deleteError;

      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete employee';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [employees]);

  const getEmployeeById = useCallback((id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  }, [employees]);

  const getEmployeesByManager = useCallback((managerId: string): Employee[] => {
    return employees.filter(emp => emp.manager_id === managerId);
  }, [employees]);

  const getPotentialManagers = useCallback((excludeId?: string): Employee[] => {
    return employees.filter(emp => 
      emp.id !== excludeId && 
      emp.permissions.some(p => ['admin', 'approve_distributions', 'approve_small_distributions'].includes(p))
    );
  }, [employees]);

  return {
    employees,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    getEmployeesByManager,
    getPotentialManagers,
  };
}

/**
 * Hook for filtering and sorting employees
 */
export function useEmployeeList(filters: EmployeeFilters = {}, sort: EmployeeSort = { field: 'name', direction: 'asc' }) {
  const { employees } = useEmployees();

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = [...employees];

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter(emp => emp.department === filters.department);
    }

    if (filters.manager_id) {
      filtered = filtered.filter(emp => emp.manager_id === filters.manager_id);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.role.toLowerCase().includes(searchTerm) ||
        emp.employee_id.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.hasPermission) {
      filtered = filtered.filter(emp => emp.permissions.includes(filters.hasPermission!));
    }

    // Apply sorting
    filtered.sort((a, b) => {
        let aValue: unknown;
    let bValue: unknown;

      // Handle computed sort fields
      if (sort.field === ('werm_balances.total_werms' as keyof Employee)) {
        aValue = computeWormBalances(a.werm_balances).total_werms;
        bValue = computeWormBalances(b.werm_balances).total_werms;
      } else if (sort.field === ('werm_balances.total_coins' as keyof Employee)) {
        aValue = computeWormBalances(a.werm_balances).total_coins;
        bValue = computeWormBalances(b.werm_balances).total_coins;
      } else {
        // Fallback to direct property access
        aValue = a[sort.field as keyof Employee];
        bValue = b[sort.field as keyof Employee];
      }

      // Sorting logic
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });


    return filtered;
  }, [employees, filters, sort]);

  return {
    employees: filteredAndSortedEmployees,
    total: filteredAndSortedEmployees.length,
  };
}

/**
 * Hook for getting employee statistics
 */
export function useEmployeeStats() {
  const [stats, setStats] = useState<EmployeeStats>();
  const [isLoading, setIsLoading] = useState(false);

  return {
    stats,
    isLoading,
  };
}

/**
 * Hook for managing employee form state
 */
export function useEmployeeForm(initialEmployee?: Employee) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const existingIds = employees.map(emp => emp.employee_id);
  const [formData, setFormData] = useState<EmployeeFormData>(() => {
    if (initialEmployee) {
      const { id, werm_balances, lifetime_earned, avatar_url, ...rest } = initialEmployee;
      return { ...rest, avatar_url };
    }
    
    return {
      employee_id: generateEmployeeId(existingIds),
      name: '',
      email: '',
      slack_username: '',
      department: 'Operations' as const,
      role: '',
      hire_date: new Date().toISOString().split('T')[0],
      manager_id: null,
      permissions: ['view_own_balance' as const],
    };
  });

  const updateFormData = useCallback((updates: Partial<EmployeeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      employee_id: generateEmployeeId(existingIds),
      name: '',
      email: '',
      slack_username: '',
      department: 'Operations',
      role: '',
      hire_date: new Date().toISOString().split('T')[0],
      manager_id: null,
      permissions: ['view_own_balance'],
    });
  }, []);

  return {
    formData,
    updateFormData,
    resetForm,
    setFormData,
  };
} 