/**
 * Delete Employee Dialog Component
 * 
 * Confirmation dialog for deleting employees with safety checks
 * and warnings about potential impacts.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Trash2, AlertTriangle, Users, Crown } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Separator,
} from '@/components/ui';
import { useEmployees } from '../hooks';
import { Employee } from '../types';
import { computeWormBalances } from '@/lib/wermTypes';
import { WERM_PRICES } from '@/lib/wermTypes';
import { CoinIndicator } from '@/components/custom/CoinIndicator';

interface DeleteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function DeleteEmployeeDialog({ open, onOpenChange, employee }: DeleteEmployeeDialogProps) {
  const { deleteEmployee, isLoading, getEmployeesByManager } = useEmployees();
  const [confirmationText, setConfirmationText] = useState('');

  // Get employees who report to this employee
  const directReports = useMemo(() => {
    if (!employee) return [];
    return getEmployeesByManager(employee.id);
  }, [employee, getEmployeesByManager]);

  const hasDirectReports = directReports.length > 0;
  const expectedConfirmationText = employee ? `DELETE ${employee.name}` : '';
  const isConfirmationValid = confirmationText === expectedConfirmationText;

  /**
   * Handle deletion
   */
  const handleDelete = useCallback(async () => {
    if (!employee || !isConfirmationValid) return;
    
    try {
      await deleteEmployee(employee.id);
      onOpenChange(false);
      setConfirmationText('');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      // Error handling would go here (toast notification, etc.)
    }
  }, [employee, isConfirmationValid, deleteEmployee, onOpenChange]);

  /**
   * Handle dialog close
   */
  const handleClose = useCallback(() => {
    setConfirmationText('');
    onOpenChange(false);
  }, [onOpenChange]);

  if (!employee) return null;

  const currentBalance = computeWormBalances(employee.werm_balances);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Employee
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the employee
            and remove all their data from the system.
          </DialogDescription>
        </DialogHeader>

        {/* Employee Info Card */}
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 pt-6">
            <img
              src={employee.avatar_url}
              alt={employee.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-lg">{employee.name}</div>
              <div className="text-sm text-muted-foreground">{employee.role}</div>
              <div className="text-sm text-muted-foreground">
                {employee.department} • {employee.employee_id}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {currentBalance.total_werms} worms
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Messages */}
        <div className="flex flex-col gap-4">
          {/* Direct Reports Warning */}
          {hasDirectReports && (
            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive text-base">
                  <Crown className="h-4 w-4" />
                  Manager of {directReports.length} Employee{directReports.length > 1 ? 's' : ''}
                </CardTitle>
                <CardDescription>
                  This employee manages other employees. You must reassign their direct reports 
                  to another manager before deletion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Direct Reports:</Label>
                  <div className="flex flex-wrap gap-2">
                    {directReports.map((report) => (
                      <Badge key={report.id} variant="outline">
                        {report.name} - {report.role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Worm Balance Warning */}
          {currentBalance.total_werms > 0 && (
            <Card className="border-orange-500 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600 text-base">
                  <AlertTriangle className="h-4 w-4" />
                  Worm Balance Will Be Lost
                </CardTitle>
                <CardDescription>
                  This employee has {currentBalance.total_coins} coins worth{' '}
                  {currentBalance.total_werms} werms. These will be 
                  permanently lost when the employee is deleted.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div className="text-center flex flex-col items-center gap-2">
                    <CoinIndicator value={currentBalance.gold} type="gold" />
                    <div className="font-medium">Gold</div>
                    <div>{currentBalance.gold * WERM_PRICES.gold} worms</div>
                  </div>
                  <div className="text-center flex flex-col items-center gap-2">
                    <CoinIndicator value={currentBalance.silver} type="silver" />
                    <div className="font-medium">Silver</div>
                    <div>{currentBalance.silver * WERM_PRICES.silver} worms</div>
                  </div>
                  <div className="text-center flex flex-col items-center gap-2">
                    <CoinIndicator value={currentBalance.bronze} type="bronze" />
                    <div className="font-medium">Bronze</div>
                    <div>{currentBalance.bronze * WERM_PRICES.bronze} worms</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Permission Warning */}
          {employee.permissions.includes('admin') && (
            <Card className="border-red-500 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 text-base">
                  <AlertTriangle className="h-4 w-4" />
                  Admin User
                </CardTitle>
                <CardDescription>
                  This employee has administrator permissions. Ensure another admin
                  can maintain system access before deletion.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* Confirmation Input */}
        {!hasDirectReports && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmation">
              Type <code className="text-sm bg-muted px-1 py-0.5 rounded">DELETE {employee.name}</code> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`DELETE ${employee.name}`}
              className="font-mono"
            />
          </div>
        )}

        <Separator />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {hasDirectReports ? (
            <Button variant="destructive" disabled>
              Cannot Delete - Has Direct Reports
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmationValid || isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Employee'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 