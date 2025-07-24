/**
 * Policies Feature Index
 * 
 * Central export point for the policies feature.
 * Exports all components, types, hooks, and utilities.
 */

// Components
export { PoliciesPage } from './components/PoliciesPage';
export { PolicyList } from './components/PolicyList';
export { AddPolicyDialog } from './components/AddPolicyDialog';
export { EditPolicyDialog } from './components/EditPolicyDialog';
export { DeletePolicyDialog } from './components/DeletePolicyDialog';
export { PolicyDetailView } from './components/PolicyDetailView';

// Hooks
export { usePolicies, usePolicyStats, usePolicyForm } from './hooks';

// Types
export type {
  Policy,
  PolicyCondition,
  PolicyFormData,
  PolicyStats,
  PolicyCategory,
  PolicyStatus,
  ConditionType,
} from './types';

// Schemas
export {
  policySchema,
  policyFormSchema,
  policyConditionSchema,
  conditionFormSchema,
  wormRewardSchema,
} from './schemas';

export type {
  PolicyForm,
  PolicyConditionForm,
  WormReward,
} from './schemas'; 