/**
 * Employees Page Component
 * 
 * Main page component for employee management that orchestrates
 * all employee-related operations and dialogs.
 */

'use client';

import { useState, useCallback } from 'react';
import { EmployeeList } from './EmployeeList';
import { AddEmployeeDialog } from './AddEmployeeDialog';
import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';
import { EmployeeDetailView } from './EmployeeDetailView';
import { Employee } from '../types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';

type DialogState = 'none' | 'add' | 'delete';
type SheetState = 'none' | 'view';

export function EmployeesPage() {
  const [dialogState, setDialogState] = useState<DialogState>('none');
  const [sheetState, setSheetState] = useState<SheetState>('none');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  /**
   * Handle opening add employee dialog
   */
  const handleAddEmployee = useCallback(() => {
    setSelectedEmployee(null);
    setDialogState('add');
  }, []);

  /**
   * Handle opening edit employee (now just opens detail view)
   */
  const handleEditEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setSheetState('view');
  }, []);

  /**
   * Handle opening delete employee dialog
   */
  const handleDeleteEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogState('delete');
  }, []);

  /**
   * Handle opening employee detail view
   */
  const handleViewEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setSheetState('view');
  }, []);

  /**
   * Handle closing dialogs
   */
  const handleCloseDialog = useCallback(() => {
    setDialogState('none');
    setSelectedEmployee(null);
  }, []);

  /**
   * Handle closing sheet
   */
  const handleCloseSheet = useCallback(() => {
    setSheetState('none');
    setSelectedEmployee(null);
  }, []);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Employee List */}
      <EmployeeList
        onAddEmployee={handleAddEmployee}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        onViewEmployee={handleViewEmployee}
      />

      {/* Add Employee Dialog */}
      <AddEmployeeDialog
        open={dialogState === 'add'}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      />

      {/* Delete Employee Dialog */}
      <DeleteEmployeeDialog
        open={dialogState === 'delete'}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
        employee={selectedEmployee}
      />

      {/* Employee Detail View Sheet */}
      <Sheet
        open={sheetState === 'view'}
        onOpenChange={(open) => {
          if (!open) handleCloseSheet();
        }}
      >
        <SheetContent className="w-[90vw] sm:w-[80vw] lg:w-[60vw] max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Employee Details
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedEmployee && <EmployeeDetailView employee={selectedEmployee} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 