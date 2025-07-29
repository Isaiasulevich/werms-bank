/**
 * Employee Types for Worm Bank Management System
 * 
 * Defines the structure and types for employee management including
 * employee creation, editing, worm balances, and permissions.
 */

export interface WormBalance {
  count: number;
  total_value: number;
}

export interface WormBalances {
  gold: WormBalance;
  silver: WormBalance;
  bronze: WormBalance;
  total_werms: number;
  total_value_aud: number;
}

export interface LifetimeEarned {
  gold: number;
  silver: number;
  bronze: number;
  total_werms: number;
  total_value_aud: number;
}

export type EmployeePermission = 
  | 'admin'
  | 'approve_distributions'
  | 'approve_small_distributions'
  | 'view_all_balances'
  | 'view_team_balances'
  | 'view_own_balance'
  | 'manage_employees'
  | 'create_policies';

export type Department = 
  | 'Operations'
  | 'Engineering'
  | 'Product'
  | 'Marketing'
  | 'Design'
  | 'Sales'
  | 'Support'
  | 'HR'
  | 'Finance'
  | 'Legal';

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  slack_username: string;
  department: Department;
  role: string;
  hire_date: string;
  manager_id: string | null;
  permissions: EmployeePermission[];
  werm_balances: WormBalances;
  lifetime_earned: LifetimeEarned;
  avatar_url: string;
  phone?: string;
  location?: string;
  bio?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type EmployeeFormData = Omit<Employee, 'id' | 'werm_balances' | 'lifetime_earned' | 'avatar_url'> & {
  avatar_url?: string;
};

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  newHiresThisMonth: number;
  totalWormDistributed: number;
  averageWormBalance: number;
  departmentBreakdown: Record<Department, number>;
}

export interface EmployeeFilters {
  department?: Department;
  manager_id?: string;
  search?: string;
  hasPermission?: EmployeePermission;
}

export interface EmployeeSort {
  field: keyof Employee;
  direction: 'asc' | 'desc';
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
}

export interface WormTransaction {
  id: string;
  employee_id: string;
  type: 'earn' | 'spend' | 'transfer' | 'adjustment';
  worm_type: 'gold' | 'silver' | 'bronze';
  amount: number;
  value_aud: number;
  description: string;
  approved_by?: string;
  created_at: string;
  policy_id?: string;
}

export interface EmployeeWithManager extends Employee {
  manager?: Pick<Employee, 'id' | 'name' | 'email' | 'role' | 'department'>;
}

export interface EmployeeWithDirectReports extends Employee {
  direct_reports?: Pick<Employee, 'id' | 'name' | 'email' | 'role' | 'department'>[];
}

// Form-specific types
export interface EmployeeFormErrors {
  name?: string;
  email?: string;
  slack_username?: string;
  department?: string;
  role?: string;
  hire_date?: string;
  manager_id?: string;
  permissions?: string;
  phone?: string;
  emergency_contact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
} 