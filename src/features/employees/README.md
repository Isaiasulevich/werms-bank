# Employee Management Feature

A comprehensive employee management system for the Werms Bank application that handles employee profiles, werm balances, organizational hierarchy, permissions, and transaction history. This feature serves as the central hub for all employee-related operations and data management.

## Overview

The Employee Management feature provides complete CRUD operations and advanced management capabilities for:
- **Employee Profiles**: Comprehensive employee information and contact details
- **Organizational Structure**: Department-based organization with manager relationships  
- **Permission System**: Role-based access control with granular permissions
- **Werm Balance Tracking**: Real-time balance monitoring across all werm types
- **Transaction History**: Complete audit trail of all werm transactions
- **Emergency Contacts**: Critical emergency contact information storage

### Key Features

- **Complete Profile Management**: Full employee lifecycle from hire to termination
- **Department Organization**: Structured department and role management
- **Permission-Based Access**: Granular permission system for security
- **Balance Tracking**: Real-time werm balances (gold, silver, bronze)
- **Lifetime Earnings**: Historical earning tracking and analytics
- **Emergency Contacts**: Critical contact information management
- **Advanced Search**: Powerful filtering and search capabilities
- **Bulk Operations**: Efficient batch operations for administrators

## Architecture

### Components

```
src/features/employees/
├── components/
│   ├── EmployeesPage.tsx           # Main page orchestrator
│   ├── EmployeeList.tsx            # Employee listing with filters
│   ├── EmployeeDetailView.tsx      # Detailed employee information
│   ├── AddEmployeeDialog.tsx       # Employee creation interface
│   └── DeleteEmployeeDialog.tsx    # Employee deletion confirmation
├── hooks.ts                        # Data management hooks
├── types.ts                        # TypeScript interfaces
├── schemas.ts                      # Zod validation schemas
└── index.ts                        # Public API exports
```

### Component Hierarchy

```
EmployeesPage (Main Orchestrator)
├── EmployeeList (Listing & Filters)
│   ├── Search/Filter Controls
│   ├── Employee Cards/Table
│   └── Pagination Controls
├── EmployeeDetailView (Sheet)
│   ├── Personal Information
│   ├── Werm Balances
│   ├── Transaction History
│   ├── Emergency Contacts
│   └── Edit Controls
├── AddEmployeeDialog (Creation)
│   ├── Basic Information Form
│   ├── Role & Department Selection
│   ├── Permission Configuration
│   └── Emergency Contact Form
└── DeleteEmployeeDialog (Confirmation)
```

## Usage

### Basic Setup

The Employee Management feature integrates into the main application routing:

```tsx
// Example: App routing integration
import { EmployeesPage } from '@/features/employees'

export default function EmployeesRoute() {
  return <EmployeesPage />
}
```

### Custom Employee Components

```tsx
import { 
  EmployeeList, 
  EmployeeDetailView,
  useEmployees 
} from '@/features/employees'

function CustomEmployeeManager() {
  const { employees, loading, error } = useEmployees()
  
  return (
    <div>
      <EmployeeList 
        employees={employees}
        onSelectEmployee={handleEmployeeSelect}
      />
    </div>
  )
}
```

## 👤 Employee Data Structure

### Core Employee Interface

```tsx
interface Employee {
  id: string                    // Unique system ID
  employee_id: string          // Human-readable employee ID
  name: string                 // Full name
  email: string                // Primary email address
  slack_username: string       // Slack integration
  department: Department       // Organizational department
  role: string                 // Job title/role
  hire_date: string            // Employment start date
  manager_id: string | null    // Direct manager reference
  permissions: EmployeePermission[]  // Access permissions
  werm_balances: WormBalances  // Current werm holdings
  lifetime_earned: LifetimeEarned    // Historical earnings
  avatar_url: string           // Profile picture URL
  phone?: string               // Contact phone
  location?: string            // Work location
  bio?: string                 // Personal bio
  emergency_contact?: {        // Emergency contact info
    name: string
    phone: string
    relationship: string
  }
}
```

### Werm Balance Structure

```tsx
interface WormBalances {
  gold: WormBalance            // Gold werm holdings
  silver: WormBalance          // Silver werm holdings  
  bronze: WormBalance          // Bronze werm holdings
  total_werms: number          // Sum of all werms
  total_value_usd: number      // USD equivalent value
}

interface WormBalance {
  count: number                // Number of werms
  total_value: number          // USD value
}
```

## Organizational Structure

### Departments

Supported department types:
- **Operations**: Core business operations
- **Engineering**: Technical development
- **Product**: Product management
- **Marketing**: Marketing and growth
- **Design**: User experience and design
- **Sales**: Sales and business development
- **Support**: Customer support
- **HR**: Human resources
- **Finance**: Financial operations
- **Legal**: Legal and compliance

### Permission System

```tsx
type EmployeePermission = 
  | 'admin'                    // Full system access
  | 'approve_distributions'    // Approve any distribution
  | 'approve_small_distributions'  // Approve small distributions
  | 'view_all_balances'        // View all employee balances
  | 'view_team_balances'       // View team member balances
  | 'view_own_balance'         // View personal balance only
  | 'manage_employees'         // Employee CRUD operations
  | 'create_policies'          // Policy creation access
```

## Hooks & Data Management

### Core Hooks

#### `useEmployees(filters?, sort?)`
Main hook for employee data management:

```tsx
const {
  employees,              // Employee[]
  loading,                // boolean
  error,                  // Error | null
  refetch,                // () => void
  createEmployee,         // (data: EmployeeFormData) => Promise<Employee>
  updateEmployee,         // (id: string, data: Partial<Employee>) => Promise<Employee>
  deleteEmployee          // (id: string) => Promise<void>
} = useEmployees()
```

#### `useEmployee(id: string)`
Single employee data hook:

```tsx
const {
  employee,               // Employee | null
  loading,                // boolean
  error,                  // Error | null
  update,                 // (data: Partial<Employee>) => Promise<Employee>
  delete: deleteEmployee  // () => Promise<void>
} = useEmployee(employeeId)
```

#### `useEmployeeFilters()`
Advanced filtering capabilities:

```tsx
const {
  filters,                // EmployeeFilters
  setFilters,             // (filters: EmployeeFilters) => void
  clearFilters,           // () => void
  filteredEmployees       // Employee[]
} = useEmployeeFilters(employees)
```

## 🔍 Search & Filtering

### Available Filters

```tsx
interface EmployeeFilters {
  department?: Department     // Filter by department
  manager_id?: string        // Filter by manager
  search?: string            // Text search across fields
  hasPermission?: EmployeePermission  // Permission-based filter
}
```

### Sorting Options

```tsx
interface EmployeeSort {
  field: keyof Employee      // Sort field
  direction: 'asc' | 'desc'  // Sort direction
}
```

### Search Capabilities

The search functionality covers:
- **Name**: Full name search with partial matching
- **Email**: Email address search
- **Employee ID**: Human-readable ID search
- **Role**: Job title search
- **Department**: Department name search

## Analytics & Statistics

### Employee Statistics

```tsx
interface EmployeeStats {
  totalEmployees: number           // Total employee count
  activeEmployees: number          // Currently active employees
  newHiresThisMonth: number        // Recent hires
  totalWormDistributed: number     // Total werms distributed
  averageWormBalance: number       // Average balance per employee
  departmentBreakdown: Record<Department, number>  // Employees per department
}
```

## Transaction Management

### Transaction History

```tsx
interface WormTransaction {
  id: string                  // Transaction ID
  employee_id: string         // Target employee
  type: 'earn' | 'spend' | 'transfer' | 'adjustment'  // Transaction type
  worm_type: 'gold' | 'silver' | 'bronze'  // Werm type
  amount: number              // Transaction amount
  value_usd: number           // USD value
  description: string         // Transaction description
  approved_by?: string        // Approver ID
  created_at: string          // Transaction timestamp
  policy_id?: string          // Related policy
}
```

## 🔒 Validation & Type Safety

### Comprehensive Validation

The feature includes extensive Zod validation for:
- **Personal Information**: Name, email, phone validation
- **Employment Data**: Hire dates, department validation
- **Emergency Contacts**: Contact information validation
- **Permissions**: Valid permission combinations
- **Werm Balances**: Numeric validation and constraints

### Form Error Handling

```tsx
interface EmployeeFormErrors {
  name?: string               // Name validation errors
  email?: string              // Email validation errors
  slack_username?: string     // Slack username errors
  department?: string         // Department selection errors
  role?: string               // Role validation errors
  hire_date?: string          // Date validation errors
  manager_id?: string         // Manager selection errors
  permissions?: string        // Permission validation errors
  phone?: string              // Phone number errors
  emergency_contact?: {       // Emergency contact errors
    name?: string
    phone?: string
    relationship?: string
  }
}
```

## UI/UX Features

- **Responsive Design**: Optimized for all screen sizes
- **Advanced Filtering**: Multiple filter combinations
- **Bulk Operations**: Select and operate on multiple employees
- **Real-time Updates**: Live balance and status updates
- **Accessibility**: Full keyboard navigation and screen reader support
- **Visual Hierarchy**: Clear information organization
- **Progressive Disclosure**: Detailed views when needed
- **Error States**: Comprehensive error handling and feedback

## Performance Optimizations

- **Virtual Scrolling**: Efficient rendering of large employee lists
- **Memoized Components**: Prevent unnecessary re-renders
- **Lazy Loading**: Load employee details on demand
- **Optimistic Updates**: Immediate UI feedback
- **Pagination**: Efficient data loading and navigation
- **Caching**: Intelligent data caching strategies

## 🧪 Testing Strategies

When testing the Employee Management feature:

1. **CRUD Operations**: Test all create, read, update, delete operations
2. **Validation**: Verify all form validation scenarios
3. **Permissions**: Test permission-based access control
4. **Search/Filter**: Verify search and filtering accuracy
5. **Balance Calculations**: Test werm balance calculations
6. **Bulk Operations**: Test multi-employee operations
7. **Integration**: Verify integration with other features

## 🔮 Future Enhancements

- **Advanced Analytics**: Detailed employee performance metrics
- **Org Chart Visualization**: Interactive organizational chart
- **Performance Reviews**: Built-in review system
- **Time Tracking**: Work hour tracking integration
- **Document Management**: Employee document storage
- **Automated Onboarding**: Streamlined new hire process
- **Integration APIs**: HRIS and payroll system integrations
- **Mobile App**: Native mobile employee directory

## 📚 Related Documentation

- [Give Werms](../give-werms/README.md) - Werm distribution to employees
- [Policies](../policies/README.md) - Policy-based employee management
- [Command Palette](../command-palette/README.md) - Employee quick actions

## 🤝 Integration Points

The Employee Management feature integrates with:
- **Give Werms System**: For werm distribution tracking
- **Policy System**: For permission and rule enforcement
- **Command Palette**: For quick employee actions and navigation
- **Dashboard**: For employee statistics and summaries

---

*Managing people, empowering success!*