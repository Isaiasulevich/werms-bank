/**
 * Policies Page Component
 * 
 * Main page component that orchestrates all policy management features.
 * Handles dialog states and coordinates between different policy views.
 */

'use client';

import { useState, useCallback } from 'react';
import { PolicyList } from './PolicyList';
import { AddPolicyDialog } from './AddPolicyDialog';
import { EditPolicyDialog } from './EditPolicyDialog';
import { DeletePolicyDialog } from './DeletePolicyDialog';
import { PolicyDetailView } from './PolicyDetailView';
import { Policy } from '../types';
import { 
  useCommandPaletteContext, 
  usePolicyCommands, 
  useRegisterCommands 
} from '@/features/command-palette';

/**
 * Dialog states for managing different modal interactions
 */
interface DialogStates {
  showAddDialog: boolean;
  showEditDialog: boolean;
  showDeleteDialog: boolean;
  showDetailView: boolean;
  selectedPolicy: Policy | null;
}

export function PoliciesPage() {
  // Dialog state management
  const [dialogs, setDialogs] = useState<DialogStates>({
    showAddDialog: false,
    showEditDialog: false,
    showDeleteDialog: false,
    showDetailView: false,
    selectedPolicy: null,
  });

  /**
   * Open the add policy dialog
   */
  const handleCreatePolicy = useCallback(() => {
    setDialogs({
      showAddDialog: true,
      showEditDialog: false,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: null,
    });
  }, []);

  /**
   * Open the edit policy dialog
   */
  const handleEditPolicy = useCallback((policy: Policy) => {
    setDialogs({
      showAddDialog: false,
      showEditDialog: true,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }, []);

  /**
   * Open the policy detail view
   */
  const handleViewPolicy = useCallback((policy: Policy) => {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,
      showDetailView: true,
      selectedPolicy: policy,
    });
  }, []);

  /**
   * Open the delete confirmation dialog
   */
  const handleDeletePolicy = useCallback((policy: Policy) => {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: true,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }, []);

  /**
   * Close all dialogs and reset state
   */
  const closeAllDialogs = useCallback(() => {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: null,
    });
  }, []);

  /**
   * Handle edit action from detail view
   */
  const handleEditFromDetail = useCallback((policy: Policy) => {
    setDialogs({
      showAddDialog: false,
      showEditDialog: true,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }, []);

  /**
   * Handle delete action from detail view
   */
  const handleDeleteFromDetail = useCallback((policy: Policy) => {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: true,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }, []);

  // Command palette integration
  const { registerProvider, unregisterProvider } = useCommandPaletteContext();
  
  // Policy-specific commands
  const policyCommands = usePolicyCommands({
    onAddPolicy: handleCreatePolicy,
    // Add more commands as needed
  });

  // Register commands when component mounts
  useRegisterCommands(
    'policies-page',
    policyCommands,
    registerProvider,
    unregisterProvider
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Main Policy List */}
      <div className="px-4 lg:px-6">
        <PolicyList
          onCreatePolicy={handleCreatePolicy}
          onEditPolicy={handleEditPolicy}
          onViewPolicy={handleViewPolicy}
          onDeletePolicy={handleDeletePolicy}
        />
      </div>

      {/* Add Policy Dialog */}
      <AddPolicyDialog
        open={dialogs.showAddDialog}
        onOpenChange={(open) => {
          if (!open) closeAllDialogs();
        }}
      />

      {/* Edit Policy Dialog */}
      <EditPolicyDialog
        open={dialogs.showEditDialog}
        onOpenChange={(open) => {
          if (!open) closeAllDialogs();
        }}
        policy={dialogs.selectedPolicy}
      />

      {/* Delete Policy Dialog */}
      <DeletePolicyDialog
        open={dialogs.showDeleteDialog}
        onOpenChange={(open) => {
          if (!open) closeAllDialogs();
        }}
        policy={dialogs.selectedPolicy}
      />

      {/* Policy Detail View */}
      <PolicyDetailView
        open={dialogs.showDetailView}
        onOpenChange={(open) => {
          if (!open) closeAllDialogs();
        }}
        policy={dialogs.selectedPolicy}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />
    </div>
  );
} 