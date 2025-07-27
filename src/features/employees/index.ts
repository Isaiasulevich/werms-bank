/**
 * Employee Feature Exports
 * 
 * Central export file for all employee-related functionality.
 * Provides clean imports for components, hooks, types, and utilities.
 */

// Components
export { EmployeeList } from './components/EmployeeList';
export { AddEmployeeDialog } from './components/AddEmployeeDialog';
export { DeleteEmployeeDialog } from './components/DeleteEmployeeDialog';
export { EmployeeDetailView } from './components/EmployeeDetailView';
export { EmployeesPage } from './components/EmployeesPage';

// Hooks
export {
  useEmployees,
  useEmployeeList,
  useEmployeeStats,
  useEmployeeForm,
} from './hooks';

// Types
export type {
  Employee,
  EmployeeFormData,
  EmployeeStats,
  EmployeeFilters,
  EmployeeSort,
  EmployeeListResponse,
  EmployeeWithManager,
  EmployeeWithDirectReports,
  EmployeeFormErrors,
  WormBalance,
  WormBalances,
  LifetimeEarned,
  WormTransaction,
  EmployeeStatus,
  EmployeePermission,
  Department,
} from './types';

// Schemas
export {
  employeeSchema,
  employeeFormSchema,
  employeeFiltersSchema,
  employeeSortSchema,
  wormTransactionSchema,
  quickAddEmployeeSchema,
  wormBalanceSchema,
  wormBalancesSchema,
  lifetimeEarnedSchema,
  emergencyContactSchema,
} from './schemas';

export type {
  EmployeeForm,
  EmployeeFilters as EmployeeFiltersType,
  EmployeeSort as EmployeeSortType,
  WormTransaction as WormTransactionType,
  QuickAddEmployee,
} from './schemas'; 