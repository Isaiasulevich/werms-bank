/**
 * Policies Page Component
 * 
 * Main page component that orchestrates all policy management features.
 * Handles dialog states and coordinates between different policy views.
 */

'use client';

import { useState } from 'react';
import { PolicyList } from './PolicyList';
import { AddPolicyDialog } from './AddPolicyDialog';
import { EditPolicyDialog } from './EditPolicyDialog';
import { DeletePolicyDialog } from './DeletePolicyDialog';
import { PolicyDetailView } from './PolicyDetailView';
import { Policy } from '../types';

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
  function handleCreatePolicy() {
    setDialogs({
      showAddDialog: true,
      showEditDialog: false,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: null,
    });
  }

  /**
   * Open the edit policy dialog
   */
  function handleEditPolicy(policy: Policy) {
    setDialogs({
      showAddDialog: false,
      showEditDialog: true,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }

  /**
   * Open the policy detail view
   */
  function handleViewPolicy(policy: Policy) {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,
      showDetailView: true,
      selectedPolicy: policy,
    });
  }

  /**
   * Open the delete confirmation dialog
   */
  function handleDeletePolicy(policy: Policy) {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: true,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }

  /**
   * Close all dialogs and reset state
   */
  function closeAllDialogs() {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: null,
    });
  }

  /**
   * Handle edit action from detail view
   */
  function handleEditFromDetail(policy: Policy) {
    setDialogs({
      showAddDialog: false,
      showEditDialog: true,
      showDeleteDialog: false,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }

  /**
   * Handle delete action from detail view
   */
  function handleDeleteFromDetail(policy: Policy) {
    setDialogs({
      showAddDialog: false,
      showEditDialog: false,
      showDeleteDialog: true,
      showDetailView: false,
      selectedPolicy: policy,
    });
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Main Policy List */}
      <PolicyList
        onCreatePolicy={handleCreatePolicy}
        onEditPolicy={handleEditPolicy}
        onViewPolicy={handleViewPolicy}
        onDeletePolicy={handleDeletePolicy}
      />

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