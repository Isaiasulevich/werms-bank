/**
 * Employee Management Hooks
 * 
 * Custom hooks for managing employee data, including CRUD operations,
 * filtering, sorting, and form management.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Employee, EmployeeFormData, EmployeeStats, EmployeeFilters, EmployeeSort } from './types';

// Import mock data from the existing employees.json
import employeesData from '@/app/dashboard/employees.json';

// Mock stats for development
const mockStats: EmployeeStats = {
  totalEmployees: employeesData.length,
  activeEmployees: employeesData.length,
  newHiresThisMonth: 3,
  totalWormDistributed: employeesData.reduce((acc, emp) => acc + emp.lifetime_earned.total_werms, 0),
  averageWormBalance: employeesData.reduce((acc, emp) => acc + emp.werm_balances.total_werms, 0) / employeesData.length,
  departmentBreakdown: employeesData.reduce((acc, emp) => {
    acc[emp.department as keyof typeof acc] = (acc[emp.department as keyof typeof acc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
};

/**
 * Generate next employee ID
 */
function generateEmployeeId(): string {
  const year = new Date().getFullYear();
  const existingIds = employeesData
    .map(emp => emp.employee_id)
    .filter(id => id.startsWith(`EMP-${year}`))
    .map(id => parseInt(id.split('-')[2]))
    .sort((a, b) => b - a);
  
  const nextNumber = existingIds.length > 0 ? existingIds[0] + 1 : 1;
  return `EMP-${year}-${nextNumber.toString().padStart(4, '0')}`;
}

/**
 * Hook for managing employee list and operations
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(employeesData as Employee[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmployee = useCallback(async (employeeData: EmployeeFormData): Promise<Employee> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for duplicate email
      if (employees.some(emp => emp.email === employeeData.email)) {
        throw new Error('Employee with this email already exists');
      }

      // Check for duplicate slack username
      if (employees.some(emp => emp.slack_username === employeeData.slack_username)) {
        throw new Error('Employee with this Slack username already exists');
      }
      
      const newEmployee: Employee = {
        ...employeeData,
        id: `emp-${Date.now()}`,
        employee_id: employeeData.employee_id || generateEmployeeId(),
        werm_balances: {
          gold: 0,
          silver: 0,
          bronze: 0,
          total_werms: 0,
          total_coins: 0,
        },
        lifetime_earned: {
          gold: 0,
          silver: 0,
          bronze: 0,
          total_werms: 0,
          total_coins: 0,
        },
        avatar_url: employeeData.avatar_url || `/avatars/${employeeData.name.toLowerCase().replace(/\s+/g, '')}.jpg`,
      };
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingEmployee = employees.find(emp => emp.id === id);
      if (!existingEmployee) {
        throw new Error('Employee not found');
      }

      // Check for duplicate email (excluding current employee)
      if (employeeData.email && employees.some(emp => emp.id !== id && emp.email === employeeData.email)) {
        throw new Error('Employee with this email already exists');
      }

      // Check for duplicate slack username (excluding current employee)
      if (employeeData.slack_username && employees.some(emp => emp.id !== id && emp.slack_username === employeeData.slack_username)) {
        throw new Error('Employee with this Slack username already exists');
      }

      const updatedEmployee: Employee = {
        ...existingEmployee,
        ...employeeData,
      };
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const employee = employees.find(emp => emp.id === id);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Check if employee is a manager of other employees
      const hasDirectReports = employees.some(emp => emp.manager_id === id);
      if (hasDirectReports) {
        throw new Error('Cannot delete employee who manages other employees. Please reassign their direct reports first.');
      }
      
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
      let aValue = a[sort.field as keyof Employee];
      let bValue = b[sort.field as keyof Employee];

      // Handle nested properties
      if (sort.field === 'werm_balances.total_werms') {
        aValue = a.werm_balances.total_werms;
        bValue = b.werm_balances.total_werms;
      } else if (sort.field === 'werm_balances.total_value_aud') {
        aValue = a.werm_balances.total_value_aud;
        bValue = b.werm_balances.total_value_aud;
      }

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
  const [stats, setStats] = useState<EmployeeStats>(mockStats);
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
  const [formData, setFormData] = useState<EmployeeFormData>(() => {
    if (initialEmployee) {
      const { id, werm_balances, lifetime_earned, avatar_url, ...rest } = initialEmployee;
      return { ...rest, avatar_url };
    }
    
    return {
      employee_id: generateEmployeeId(),
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
      employee_id: generateEmployeeId(),
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