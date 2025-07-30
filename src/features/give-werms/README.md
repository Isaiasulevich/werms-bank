# Give Werms Feature

A powerful werm distribution system that allows administrators to distribute different types of werms (gold, silver, platinum) to employees based on predefined policies. This feature enables bulk distributions, individual allocations, and comprehensive tracking of all werm transactions.

## Overview

The Give Werms feature provides a centralized interface for:
- **Bulk Distribution**: Distribute werms to multiple employees simultaneously
- **Policy-Based Rewards**: Automatic werm allocation based on company policies
- **Multi-Type Currency**: Support for gold, silver, and platinum werms
- **Batch Tracking**: Complete audit trail of all distributions
- **Preview System**: Review distributions before executing
- **Notes & Context**: Add context and reasoning for distributions

### Key Features

- **Multi-Currency Support**: Gold, silver, and platinum werm types
- **Batch Operations**: Distribute to multiple employees at once
- **Distribution Preview**: See exactly what will be distributed before confirming
- **Audit Trail**: Complete tracking of who distributed what, when, and why
- **Policy Integration**: Seamless integration with company policy system
- **Flexible Amounts**: Custom amounts per employee or policy defaults

## Architecture

### Components

```
src/features/give-werms/
├── components/
│   ├── GiveWermsCard.tsx           # Main entry card component
│   ├── GiveWermsDialog.tsx         # Distribution interface dialog
│   └── index.ts                    # Component exports
├── types.ts                        # TypeScript interfaces
├── schemas.ts                      # Zod validation schemas
└── index.ts                        # Public API exports
```

### Component Hierarchy

```
GiveWermsCard (Entry Point)
└── GiveWermsDialog (Main Interface)
    ├── Policy Selection
    ├── Employee Selection (Multi-select)
    ├── Amount Configuration
    ├── Distribution Preview
    └── Confirmation Actions
```

## Usage

### Basic Setup

The Give Werms feature is integrated into the dashboard and can be accessed through the main cards interface:

```tsx
// Example: Dashboard integration
import { GiveWermsCard } from '@/features/give-werms'

export function Dashboard() {
  return (
    <div className="grid gap-4">
      <GiveWermsCard />
      {/* Other dashboard cards */}
    </div>
  )
}
```

### Distribution Flow

1. **Select Policy**: Choose the policy that governs this distribution
2. **Select Employees**: Pick one or multiple employees to receive werms
3. **Configure Amounts**: Set individual amounts or use policy defaults
4. **Add Context**: Include notes explaining the distribution
5. **Preview**: Review the distribution summary
6. **Execute**: Confirm and process the distribution

### Example Integration

```tsx
import { GiveWermsDialog } from '@/features/give-werms'

function CustomDistributionTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Distribute Werms
      </Button>
      
      <GiveWermsDialog 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
```

## Werm Types

| Type | Description | Typical Use Case |
|------|-------------|------------------|
| **Gold** | Highest value werms | Exceptional performance, major achievements |
| **Silver** | Standard reward werms | Regular recognition, meeting goals |
| **Platinum** | Premium special werms | Extraordinary contributions, leadership |

## Data Structure

### WermDistribution

Core distribution record for individual allocations:

```tsx
interface WermDistribution {
  id: string                    // Unique distribution ID
  employeeId: string           // Recipient employee ID
  policyId: string             // Governing policy ID
  amount: number               // Number of werms distributed
  wermType: "gold" | "silver" | "platinum"  // Type of werm
  createdAt: Date              // Distribution timestamp
  createdBy: string            // Distributor's user ID
  notes?: string               // Optional context/reasoning
}
```

### DistributionBatch

Batch record for group distributions:

```tsx
interface DistributionBatch {
  id: string                   // Unique batch ID
  policyId: string             // Governing policy ID
  distributions: WermDistribution[]  // Individual distributions
  totalAmount: number          // Total werms in batch
  createdAt: Date              // Batch creation time
  createdBy: string            // Batch creator's ID
  notes?: string               // Batch-level notes
}
```

### DistributionFormData

Form interface for creating distributions:

```tsx
interface DistributionFormData {
  policyId: string             // Selected policy
  employees: {
    employeeId: string         // Target employee
    amount: number             // Werm amount
    notes?: string             // Individual notes
  }[]
  batchNotes?: string          // Overall batch context
}
```

## Validation

The feature includes comprehensive validation using Zod schemas:

### Distribution Validation
- **Amount**: Must be at least 1 werm
- **Employee**: Valid UUID required
- **Policy**: Must reference existing policy
- **Type**: Must be gold, silver, or platinum

### Batch Validation
- **Employees**: At least one employee required
- **Policy**: Valid policy selection mandatory
- **UUIDs**: All IDs validated as proper UUIDs

## UI/UX Features

- **Intuitive Flow**: Step-by-step distribution process
- **Visual Feedback**: Clear indicators for werm types and amounts
- **Bulk Selection**: Easy multi-employee selection with checkboxes
- **Amount Presets**: Quick selection from policy defaults
- **Preview System**: Comprehensive review before execution
- **Error Handling**: Clear validation messages and error states
- **Responsive Design**: Works across all device sizes

## 🔒 Type Safety

Complete TypeScript coverage ensures:
- **Strict Interfaces**: All data structures properly typed
- **Zod Validation**: Runtime validation with compile-time types
- **Generic Support**: Flexible typing for extensions
- **Enum Safety**: Werm types strictly enforced

## Performance Considerations

- **Memoized Components**: Prevent unnecessary re-renders
- **Batch Processing**: Efficient bulk operations
- **Lazy Loading**: Components load only when needed
- **Optimistic Updates**: Immediate UI feedback
- **Error Boundaries**: Graceful failure handling

## 🧪 Testing Strategies

When testing the Give Werms feature:

1. **Distribution Logic**: Verify correct calculations and allocations
2. **Validation**: Test all form validation scenarios
3. **Batch Operations**: Ensure bulk distributions work correctly
4. **Error States**: Test network failures and validation errors
5. **Integration**: Verify policy and employee system integration

## 🔮 Future Enhancements

- **Recurring Distributions**: Scheduled automatic distributions
- **Advanced Filters**: More sophisticated employee selection
- **Distribution Templates**: Saved distribution configurations
- **Approval Workflows**: Multi-step approval for large distributions
- **Analytics Dashboard**: Distribution insights and trends
- **Integration APIs**: External system integrations
- **Mobile App**: Native mobile distribution interface

## 📚 Related Documentation

- [Policy Management](../policies/README.md) - Understanding distribution policies
- [Employee System](../employees/README.md) - Employee management integration
- [Command Palette](../command-palette/README.md) - Quick distribution commands

## 🤝 Integration Points

The Give Werms feature integrates with:
- **Policies System**: For distribution rules and validation
- **Employee System**: For recipient information and balances
- **Command Palette**: For keyboard shortcuts and quick actions
- **Dashboard**: For main application interface

---

*Distribute werms responsibly!*