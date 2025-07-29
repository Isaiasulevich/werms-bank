/**
 * Employee Feature Exports
 * 
 * Central export point for all employee-related components, types, and utilities.
 */

// Components
export { EmployeesPage } from './components/EmployeesPage';
export { EmployeeList } from './components/EmployeeList';
export { AddEmployeeDialog } from './components/AddEmployeeDialog';
export { DeleteEmployeeDialog } from './components/DeleteEmployeeDialog';
export { EmployeeDetailView } from './components/EmployeeDetailView';

// Hooks
export { 
  useEmployees, 
  useEmployeeStats, 
  useEmployeeFilters 
} from './hooks';

// Types
export type {
  Employee,
  EmployeeFormData,
  EmployeeStats,
  EmployeeFilters,
  EmployeeSort,
  EmployeeListResponse,
  WormTransaction,
  EmployeeWithManager,
  EmployeeWithDirectReports,
  EmployeeFormErrors,
  EmployeePermission,
  Department,
  WormBalance,
  WormBalances,
  LifetimeEarned
} from './types';

// Schemas
export {
  employeeSchema,
  employeeFormSchema,
  employeeFiltersSchema,
  employeeSortSchema,
  wormTransactionSchema,
  quickAddEmployeeSchema
} from './schemas'; 