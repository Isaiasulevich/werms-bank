# Policy Management Feature

A comprehensive policy management system that defines and manages automated werm distribution rules, conditions, and approval workflows. This feature serves as the central governance system for all werm-related activities and organizational policies within the Werms Bank application.

## Overview

The Policy Management feature provides complete control over organizational policies including:
- **Automated Distribution Rules**: Define conditions that trigger automatic werm rewards
- **Approval Workflows**: Configure approval requirements for different policy types
- **Performance Tracking**: Monitor policy effectiveness and trigger frequency
- **Category Management**: Organize policies by business function (distribution, minting, recognition, compliance, performance)
- **Condition Management**: Complex multi-condition policies with flexible triggers
- **Audit Trail**: Complete history of policy changes and activations

### Key Features

- **Policy Templates**: Pre-defined templates for common policy types
- **Automated Triggers**: Smart condition evaluation and automatic execution
- **✅ Approval Workflows**: Multi-level approval for sensitive operations
- **Performance Analytics**: Track policy effectiveness and usage statistics
- **🔄 Version Control**: Complete audit trail of policy modifications
- **Condition Logic**: Complex condition combinations with AND/OR logic
- **⏰ Scheduling**: Time-based and event-based policy triggers
- **🔐 Permission Controls**: Role-based policy creation and modification rights

## 🏗️ Architecture

### Components

```
src/features/policies/
├── components/
│   ├── PoliciesPage.tsx            # Main page orchestrator
│   ├── PolicyList.tsx              # Policy listing with filters
│   ├── PolicyDetailView.tsx        # Detailed policy information
│   ├── AddPolicyDialog.tsx         # Policy creation interface
│   ├── EditPolicyDialog.tsx        # Policy modification interface
│   └── DeletePolicyDialog.tsx      # Policy deletion confirmation
├── hooks.ts                        # Data management hooks
├── types.ts                        # TypeScript interfaces
├── schemas.ts                      # Zod validation schemas
└── index.ts                        # Public API exports
```

### Component Hierarchy

```
PoliciesPage (Main Orchestrator)
├── PolicyList (Listing & Management)
│   ├── Filter Controls
│   ├── Policy Cards
│   ├── Status Indicators
│   └── Action Buttons
├── PolicyDetailView (Sheet)
│   ├── Policy Information
│   ├── Conditions List
│   ├── Performance Metrics
│   ├── Audit History
│   └── Edit Controls
├── AddPolicyDialog (Creation)
│   ├── Basic Information Form
│   ├── Category Selection
│   ├── Condition Builder
│   └── Preview & Validation
├── EditPolicyDialog (Modification)
│   ├── Information Updates
│   ├── Condition Management
│   ├── Status Controls
│   └── Version History
└── DeletePolicyDialog (Confirmation)
```

## Usage

### Basic Setup

The Policy Management feature integrates into the main application routing:

```tsx
// Example: App routing integration
import { PoliciesPage } from '@/features/policies'

export default function PoliciesRoute() {
  return <PoliciesPage />
}
```

### Custom Policy Integration

```tsx
import { 
  PolicyList, 
  PolicyDetailView,
  usePolicies,
  usePolicyEvaluation
} from '@/features/policies'

function CustomPolicyManager() {
  const { policies, createPolicy, updatePolicy } = usePolicies()
  const { evaluateConditions } = usePolicyEvaluation()
  
  return (
    <div>
      <PolicyList 
        policies={policies}
        onSelectPolicy={handlePolicySelect}
      />
    </div>
  )
}
```

## Policy Data Structure

### Core Policy Interface

```tsx
interface Policy {
  id: string                    // Unique policy identifier
  title: string                 // Human-readable policy name
  description: string           // Detailed policy description
  category: PolicyCategory      // Business category classification
  status: PolicyStatus          // Current activation status
  conditions: PolicyCondition[] // Triggering conditions
  createdBy: {                  // Policy creator information
    name: string
    email: string
    role: string
  }
  createdAt: string            // Creation timestamp
  updatedAt: string            // Last modification timestamp
  effectiveDate: string        // When policy becomes active
  expirationDate?: string      // Optional expiration date
  isSystemPolicy: boolean      // System vs user-created flag
}
```

### Policy Categories

```tsx
type PolicyCategory = 
  | 'distribution'    // Werm distribution policies
  | 'minting'         // Werm creation policies
  | 'recognition'     // Employee recognition policies
  | 'compliance'      // Regulatory compliance policies
  | 'performance'     // Performance-based rewards
```

### Policy Status

```tsx
type PolicyStatus = 
  | 'active'     // Currently enforced
  | 'inactive'   // Disabled but preserved
  | 'draft'      // In development, not enforced
```

## Condition System

### Policy Conditions

```tsx
interface PolicyCondition {
  id: string                    // Unique condition identifier
  type: ConditionType           // Type of condition
  description: string           // Human-readable description
  trigger: string               // Technical trigger definition
  wormReward: {                 // Reward structure
    gold?: number
    silver?: number
    platinum?: number
  }
  requiresApproval: boolean     // Manual approval required
  isActive: boolean             // Condition enabled/disabled
}
```

### Condition Types

```tsx
type ConditionType = 
  | 'attendance'     // Attendance-based triggers
  | 'performance'    // Performance metric triggers
  | 'milestone'      // Project/goal milestone triggers
  | 'custom'         // Custom business logic triggers
```

### Example Conditions

#### Attendance Policy
```tsx
{
  type: 'attendance',
  description: 'Employee arrives on time',
  trigger: 'Clock-in before 9:00 AM',
  wormReward: { bronze: 1 },
  requiresApproval: false
}
```

#### Performance Policy
```tsx
{
  type: 'performance',
  description: 'Project completed ahead of schedule',
  trigger: 'Project completion 2+ days early',
  wormReward: { gold: 3 },
  requiresApproval: true
}
```

## Hooks & Data Management

### Core Hooks

#### `usePolicies()`
Main hook for policy data management:

```tsx
const {
  policies,               // Policy[]
  isLoading,              // boolean
  error,                  // Error | null
  createPolicy,           // (data: PolicyFormData) => Promise<Policy>
  updatePolicy,           // (id: string, data: Partial<Policy>) => Promise<Policy>
  deletePolicy,           // (id: string) => Promise<void>
  activatePolicy,         // (id: string) => Promise<Policy>
  deactivatePolicy        // (id: string) => Promise<Policy>
} = usePolicies()
```

#### `usePolicy(id: string)`
Single policy data hook:

```tsx
const {
  policy,                 // Policy | null
  isLoading,              // boolean
  error,                  // Error | null
  update,                 // (data: Partial<Policy>) => Promise<Policy>
  delete: deletePolicy,   // () => Promise<void>
  activate,               // () => Promise<Policy>
  deactivate             // () => Promise<Policy>
} = usePolicy(policyId)
```

#### `usePolicyStats()`
Policy analytics and statistics:

```tsx
const {
  stats,                  // PolicyStats
  isLoading,              // boolean
  refresh                 // () => void
} = usePolicyStats()

interface PolicyStats {
  totalPolicies: number           // Total policy count
  activePolicies: number          // Currently active policies
  triggeredToday: number          // Policies triggered today
  totalWormDistributed: number    // Total werms distributed via policies
}
```

## 🔍 Policy Evaluation System

### Condition Evaluation

The system automatically evaluates policy conditions based on:
- **Employee Actions**: Clock-ins, project completions, performance metrics
- **Time Triggers**: Scheduled evaluations (daily, weekly, monthly)
- **Event Triggers**: System events, milestones, external integrations
- **Manual Triggers**: Administrator-initiated evaluations

### Approval Workflow

Policies requiring approval follow this workflow:
1. **Condition Met**: System detects triggering condition
2. **Approval Queue**: Creates approval request for designated approvers
3. **Review Process**: Approvers review context and employee eligibility
4. **Decision**: Approve or reject the werm distribution
5. **Execution**: Approved distributions are processed automatically

## 🔒 Validation & Type Safety

### Comprehensive Validation

```tsx
// Policy validation schema
const policySchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  category: z.enum(['distribution', 'minting', 'recognition', 'compliance', 'performance']),
  status: z.enum(['active', 'inactive', 'draft']),
  conditions: z.array(policyConditionSchema).min(1).max(4),
  effectiveDate: z.string(),
  expirationDate: z.string().optional()
})

// Condition validation schema
const policyConditionSchema = z.object({
  type: z.enum(['attendance', 'performance', 'milestone', 'custom']),
  description: z.string().min(1).max(500),
  trigger: z.string().min(1).max(200),
  wormReward: wormRewardSchema,
  requiresApproval: z.boolean(),
  isActive: z.boolean()
})

// Worm reward validation
const wormRewardSchema = z.object({
  gold: z.number().min(0).optional(),
  silver: z.number().min(0).optional(),
  platinum: z.number().min(0).optional()
}).refine(
  (data) => (data.gold ?? 0) + (data.silver ?? 0) + (data.platinum ?? 0) > 0,
  { message: "At least one worm type must have a value greater than 0" }
)
```

## Policy Analytics

### Performance Tracking

The system tracks comprehensive policy metrics:
- **Trigger Frequency**: How often each policy activates
- **Distribution Volume**: Total werms distributed per policy
- **Approval Rates**: Percentage of approvals vs rejections
- **Employee Impact**: Which employees benefit most from each policy
- **Cost Analysis**: Financial impact of policy distributions

### Reporting Features

- **Policy Effectiveness Reports**: Success metrics and ROI analysis
- **Compliance Reports**: Regulatory compliance tracking
- **Distribution Reports**: Detailed distribution breakdowns
- **Audit Reports**: Complete change and activation history

## UI/UX Features

- **Intuitive Policy Builder**: Step-by-step policy creation wizard
- **Visual Condition Logic**: Graphical representation of complex conditions
- **Real-time Validation**: Instant feedback on policy configuration
- **Template Library**: Pre-built templates for common policies
- **Bulk Operations**: Manage multiple policies simultaneously
- **Search & Filter**: Advanced policy discovery capabilities
- **Status Indicators**: Clear visual policy status representation
- **Impact Preview**: Estimate policy impact before activation

## Performance Optimizations

- **Efficient Evaluation**: Optimized condition evaluation algorithms
- **Caching Strategy**: Intelligent caching of policy data and evaluations
- **Background Processing**: Asynchronous policy execution
- **Batch Operations**: Efficient bulk policy operations
- **Lazy Loading**: Load policy details only when needed
- **Memoization**: Prevent unnecessary component re-renders

## 🧪 Testing Strategies

When testing the Policy Management feature:

1. **Policy CRUD**: Test all create, read, update, delete operations
2. **Condition Logic**: Verify complex condition evaluation accuracy
3. **Approval Workflows**: Test approval process end-to-end
4. **Performance**: Load test with large numbers of policies
5. **Validation**: Test all validation scenarios and edge cases
6. **Integration**: Verify integration with employee and distribution systems
7. **Security**: Test permission-based access controls

## 🔮 Future Enhancements

- **AI-Powered Suggestions**: Machine learning policy recommendations
- **Advanced Condition Logic**: Support for complex Boolean logic (AND/OR/NOT)
- **External Integrations**: Connect with HR systems, time tracking, and performance tools
- **Policy Versioning**: Full version control with rollback capabilities
- **A/B Testing**: Policy effectiveness testing framework
- **Mobile Management**: Native mobile policy management interface
- **Real-time Notifications**: Instant alerts for policy triggers and approvals
- **Custom Triggers**: User-defined custom condition types

## 📚 Related Documentation

- [Give Werms](../give-werms/README.md) - Policy-driven werm distribution
- [Employee Management](../employees/README.md) - Employee data for policy evaluation
- [Command Palette](../command-palette/README.md) - Quick policy actions

## 🤝 Integration Points

The Policy Management feature integrates with:
- **Give Werms System**: For executing policy-driven distributions
- **Employee System**: For policy target evaluation and eligibility
- **Command Palette**: For quick policy creation and management
- **Dashboard**: For policy statistics and performance metrics
- **Notification System**: For approval workflows and alerts

---

*Governing with wisdom, rewarding with purpose! 📜⚖️*