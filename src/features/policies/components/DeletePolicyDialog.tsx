/**
 * Delete Policy Dialog Component
 * 
 * Confirmation dialog for deleting policies. Shows policy details
 * and warns about consequences of deletion.
 */

'use client';

import { useCallback } from 'react';
import { AlertTriangle, Shield, Users, Clock } from 'lucide-react';
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
  Separator,
} from '@/components/ui';
import { usePolicies } from '../hooks';
import { Policy } from '../types';

interface DeletePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy | null;
}

export function DeletePolicyDialog({ open, onOpenChange, policy }: DeletePolicyDialogProps) {
  const { deletePolicy, isLoading } = usePolicies();

  /**
   * Handle policy deletion
   */
  const handleDelete = useCallback(async () => {
    if (!policy) return;
    
    try {
      await deletePolicy(policy.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete policy:', error);
      // Error handling would go here (toast notification, etc.)
    }
  }, [policy, deletePolicy, onOpenChange]);

  /**
   * Get category display info
   */
  function getCategoryInfo(category: string) {
    switch (category) {
      case 'distribution':
        return { name: 'Distribution', icon: '🏦', color: 'text-chart-2' };
      case 'minting':
        return { name: 'Minting', icon: '⚡', color: 'text-chart-4' };
      case 'recognition':
        return { name: 'Recognition', icon: 'REC', color: 'text-chart-3' };
      case 'compliance':
        return { name: 'Compliance', icon: 'COM', color: 'text-chart-1' };
      default:
        return { name: category, icon: '📄', color: 'text-muted-foreground' };
    }
  }

  /**
   * Get total worm reward from all conditions
   */
  function getTotalWormReward(policy: Policy) {
    const totals = { gold: 0, silver: 0, bronze: 0 };
    
    policy.conditions.forEach(condition => {
      if (condition.wormReward) {
        totals.gold += condition.wormReward.gold || 0;
        totals.silver += condition.wormReward.silver || 0;
        totals.bronze += condition.wormReward.bronze || 0;
      }
    });

    return totals;
  }

  /**
   * Format worm reward display
   */
  function formatWormReward(totals: { gold: number; silver: number; platinum: number }) {
  const parts = [];
  if (totals.gold > 0) parts.push(`${totals.gold} Gold`);
  if (totals.silver > 0) parts.push(`${totals.silver} Silver`);
  if (totals.platinum > 0) parts.push(`${totals.platinum} Platinum`);
  return parts.length > 0 ? parts.join(', ') : 'No rewards';
}

  if (!policy) return null;

  const categoryInfo = getCategoryInfo(policy.category);
  const totalRewards = getTotalWormReward(policy);
  const activeConditions = policy.conditions.filter(c => c.isActive).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">Delete Policy</DialogTitle>
              <DialogDescription className="text-left">
                Are you sure you want to delete this policy? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Policy Overview */}
        <div className="flex flex-col gap-4">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <div>
                    <CardTitle className="text-base text-destructive">{policy.title}</CardTitle>
                    <CardDescription className="text-destructive/80">
                      {categoryInfo.name} • Created by {policy.createdBy.name}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                  {policy.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-destructive/90 mb-3">{policy.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-destructive" />
                  <span className="text-destructive/80">
                    {activeConditions} active condition{activeConditions !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-destructive" />
                  <span className="text-destructive/80">
                    Affects all employees
                  </span>
                </div>
              </div>

              {(totalRewards.gold > 0 || totalRewards.silver > 0 || totalRewards.platinum > 0) && (
                <div className="mt-3 pt-3 border-t border-destructive/20">
                  <div className="text-xs text-destructive/80 font-medium mb-1">Total Rewards:</div>
                  <div className="text-xs text-destructive/90">{formatWormReward(totalRewards)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warning Message */}
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    What happens when you delete this policy:
                  </h4>
                  <ul className="space-y-1 text-xs text-yellow-800 dark:text-yellow-200">
                    <li>• Policy will be permanently removed from the system</li>
                    <li>• All associated conditions will be deleted</li>
                    <li>• Automatic worm distributions will stop immediately</li>
                    <li>• Historical data will be preserved for audit purposes</li>
                    {policy.status === 'active' && (
                      <li className="font-medium">• This policy is currently active and affecting employees</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Policy Warning */}
          {policy.isSystemPolicy && (
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-destructive mb-1">
                      System Policy Warning
                    </h4>
                    <p className="text-xs text-destructive/90">
                      This is a system policy that may be critical for bank operations. 
                      Deleting it could affect core functionality. Please ensure you have 
                      authorization before proceeding.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Delete Policy
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 