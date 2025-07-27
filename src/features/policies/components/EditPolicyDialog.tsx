/**
 * Edit Policy Dialog Component
 * 
 * Modal dialog for editing existing policies. Reuses the AddPolicyDialog
 * components but pre-populates with existing policy data.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, X, AlertCircle, Info, Clock } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from '@/components/ui';
import { usePolicies, usePolicyForm } from '../hooks';
import { Policy, PolicyCondition, ConditionType, PolicyCategory, PolicyStatus } from '../types';

interface EditPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy | null;
}

/**
 * Condition form component for individual policy conditions (reused from AddPolicyDialog)
 */
function ConditionForm({
  condition,
  onUpdate,
  onRemove,
  canRemove = true,
}: {
  condition: Partial<PolicyCondition>;
  onUpdate: (updates: Partial<PolicyCondition>) => void;
  onRemove: () => void;
  canRemove?: boolean;
}) {
  /**
   * Get worm reward display text
   */
  function getRewardDisplay() {
    const { gold = 0, silver = 0, platinum = 0 } = condition.wormReward || {};
    const parts = [];
    if (gold > 0) parts.push(`${gold} Gold`);
    if (silver > 0) parts.push(`${silver} Silver`);
    if (platinum > 0) parts.push(`${platinum} Platinum`);
    return parts.length > 0 ? parts.join(', ') : 'No reward set';
  }

  /**
   * Get condition type info
   */
  function getConditionTypeInfo(type: ConditionType) {
    switch (type) {
      case 'attendance':
        return { name: 'Attendance', icon: '⏰', description: 'Based on arrival time or attendance patterns' };
      case 'performance':
        return { name: 'Performance', icon: '📈', description: 'Based on work quality or achievement metrics' };
      case 'milestone':
        return { name: 'Milestone', icon: '🎯', description: 'Based on project or goal completion' };
      case 'custom':
        return { name: 'Custom', icon: '⚙️', description: 'Custom condition or automated trigger' };
      default:
        return { name: 'Select Type', icon: '❓', description: 'Choose a condition type' };
    }
  }

  const typeInfo = getConditionTypeInfo(condition.type as ConditionType);

  return (
    <Card className="relative">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeInfo.icon}</span>
            <div>
              <CardTitle className="text-base">{typeInfo.name} Condition</CardTitle>
              <CardDescription className="text-xs">{typeInfo.description}</CardDescription>
            </div>
          </div>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Condition Type Selection */}
        <div className="flex flex-col gap-2">
          <Label htmlFor={`condition-type-${condition.id}`}>Condition Type *</Label>
          <Select 
            value={condition.type || ''} 
            onValueChange={(value) => onUpdate({ type: value as ConditionType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">⏰ Attendance - Time & presence tracking</SelectItem>
              <SelectItem value="performance">📈 Performance - Quality & metrics</SelectItem>
              <SelectItem value="milestone">🎯 Milestone - Goals & projects</SelectItem>
              <SelectItem value="custom">⚙️ Custom - Automated or manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Label htmlFor={`condition-description-${condition.id}`}>Description *</Label>
          <Textarea
            id={`condition-description-${condition.id}`}
            placeholder="Describe what triggers this condition..."
            value={condition.description || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate({ description: e.target.value })}
            className="min-h-[80px]"
          />
        </div>

        {/* Trigger Condition */}
        <div className="flex flex-col gap-2">
          <Label htmlFor={`condition-trigger-${condition.id}`}>Trigger Condition *</Label>
          <Input
            id={`condition-trigger-${condition.id}`}
            placeholder="e.g., 'Clock-in before 9:00 AM' or 'Complete project 2+ days early'"
            value={condition.trigger || ''}
            onChange={(e) => onUpdate({ trigger: e.target.value })}
          />
        </div>

        {/* Worm Rewards */}
        <div className="flex flex-col gap-3">
          <Label>Worm Rewards *</Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor={`gold-${condition.id}`} className="text-xs text-worm-gold">🥇 Gold</Label>
              <Input
                id={`gold-${condition.id}`}
                type="number"
                min="0"
                placeholder="0"
                value={condition.wormReward?.gold || ''}
                onChange={(e) => onUpdate({
                  wormReward: {
                    ...condition.wormReward,
                    gold: e.target.value ? parseInt(e.target.value) : 0
                  }
                })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor={`silver-${condition.id}`} className="text-xs text-worm-silver">🥈 Silver</Label>
              <Input
                id={`silver-${condition.id}`}
                type="number"
                min="0"
                placeholder="0"
                value={condition.wormReward?.silver || ''}
                onChange={(e) => onUpdate({
                  wormReward: {
                    ...condition.wormReward,
                    silver: e.target.value ? parseInt(e.target.value) : 0
                  }
                })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor={`platinum-${condition.id}`} className="text-xs text-worm-platinum">🏆 Platinum</Label>
              <Input
                id={`platinum-${condition.id}`}
                type="number"
                min="0"
                placeholder="0"
                value={condition.wormReward?.platinum || ''}
                onChange={(e) => onUpdate({
                  wormReward: {
                    ...condition.wormReward,
                    platinum: e.target.value ? parseInt(e.target.value) : 0
                  }
                })}
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Reward: {getRewardDisplay()}
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`approval-${condition.id}`}
              checked={condition.requiresApproval || false}
              onCheckedChange={(checked) => onUpdate({ requiresApproval: checked as boolean })}
            />
            <Label htmlFor={`approval-${condition.id}`} className="text-sm">
              Requires manager approval before worm distribution
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`active-${condition.id}`}
              checked={condition.isActive !== false}
              onCheckedChange={(checked) => onUpdate({ isActive: checked as boolean })}
            />
            <Label htmlFor={`active-${condition.id}`} className="text-sm">
              Condition is active and can be triggered
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EditPolicyDialog({ open, onOpenChange, policy }: EditPolicyDialogProps) {
  const { updatePolicy, isLoading } = usePolicies();
  const { formData, updateFormData, resetForm, setFormData } = usePolicyForm(policy || undefined);
  const [currentStep, setCurrentStep] = useState<'basic' | 'conditions' | 'review'>('basic');

  // Initialize form data when policy changes
  useEffect(() => {
    if (policy && open) {
      const { id, createdAt, updatedAt, createdBy, ...policyData } = policy;
      setFormData(policyData);
    }
  }, [policy, open, setFormData]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!policy) return;
    
    try {
      // Validate that we have at least one condition
      if (formData.conditions.length === 0) {
        setCurrentStep('conditions');
        return;
      }

      // Update the policy
      await updatePolicy(policy.id, formData);
      
      // Reset form and close dialog
      resetForm();
      setCurrentStep('basic');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update policy:', error);
      // Error handling would go here (toast notification, etc.)
    }
  }, [policy, formData, updatePolicy, resetForm, onOpenChange]);

  /**
   * Add a new condition
   */
  const addCondition = useCallback(() => {
    const newCondition: Partial<PolicyCondition> = {
      id: `cond-${Date.now()}`,
      type: 'attendance',
      description: '',
      trigger: '',
              wormReward: { platinum: 1 },
      requiresApproval: false,
      isActive: true,
    };

    updateFormData({
      conditions: [...formData.conditions, newCondition as PolicyCondition]
    });
  }, [formData.conditions, updateFormData]);

  /**
   * Update a specific condition
   */
  const updateCondition = useCallback((index: number, updates: Partial<PolicyCondition>) => {
    const updatedConditions = [...formData.conditions];
    updatedConditions[index] = { ...updatedConditions[index], ...updates };
    updateFormData({ conditions: updatedConditions });
  }, [formData.conditions, updateFormData]);

  /**
   * Remove a condition
   */
  const removeCondition = useCallback((index: number) => {
    const updatedConditions = formData.conditions.filter((_, i) => i !== index);
    updateFormData({ conditions: updatedConditions });
  }, [formData.conditions, updateFormData]);

  /**
   * Handle dialog close
   */
  const handleClose = useCallback(() => {
    resetForm();
    setCurrentStep('basic');
    onOpenChange(false);
  }, [resetForm, onOpenChange]);

  /**
   * Validate current step
   */
  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case 'basic':
        return formData.title.trim().length > 0 && formData.description.trim().length > 0;
      case 'conditions':
        return formData.conditions.length > 0 && formData.conditions.every(c => 
          c.description?.trim() && c.trigger?.trim() && 
          ((c.wormReward?.gold || 0) + (c.wormReward?.silver || 0) + (c.wormReward?.platinum || 0) > 0)
        );
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Policy: {policy.title}</DialogTitle>
          <DialogDescription>
            Update the policy settings, conditions, and rewards.
            {policy.isSystemPolicy && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">System Policy</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  This is a system policy. Some changes may require administrator approval.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant={currentStep === 'basic' ? 'default' : 'secondary'}>
            1. Basic Info
          </Badge>
          <div className="h-px bg-border flex-1" />
          <Badge variant={currentStep === 'conditions' ? 'default' : 'secondary'}>
            2. Conditions
          </Badge>
          <div className="h-px bg-border flex-1" />
          <Badge variant={currentStep === 'review' ? 'default' : 'secondary'}>
            3. Review
          </Badge>
        </div>

        {/* Basic Information Step */}
        {currentStep === 'basic' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="policy-title">Policy Title *</Label>
                <Input
                  id="policy-title"
                  placeholder="e.g., Daily Attendance Rewards"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="policy-description">Description *</Label>
                <Textarea
                  id="policy-description"
                  placeholder="Describe the purpose and scope of this policy..."
                  value={formData.description}
                                     onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="policy-category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => updateFormData({ category: value as PolicyCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recognition">🏆 Recognition - Employee rewards</SelectItem>
                      <SelectItem value="distribution">🏦 Distribution - Worm allocation</SelectItem>
                      <SelectItem value="minting">⚡ Minting - Worm creation</SelectItem>
                      <SelectItem value="compliance">📋 Compliance - Rule enforcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="policy-status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => updateFormData({ status: value as PolicyStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">📝 Draft - Not yet active</SelectItem>
                      <SelectItem value="active">✅ Active - Currently enforced</SelectItem>
                      <SelectItem value="inactive">⏸️ Inactive - Temporarily disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="effective-date">Effective Date *</Label>
                <Input
                  id="effective-date"
                  type="date"
                  value={formData.effectiveDate.split('T')[0]}
                  onChange={(e) => updateFormData({ effectiveDate: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
                <Input
                  id="expiration-date"
                  type="date"
                  value={formData.expirationDate?.split('T')[0] || ''}
                  onChange={(e) => updateFormData({ expirationDate: e.target.value || undefined })}
                />
                <div className="text-xs text-muted-foreground">
                  Leave blank for policies that don't expire
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditions Step */}
        {currentStep === 'conditions' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Policy Conditions</h3>
                <p className="text-sm text-muted-foreground">
                  Update conditions that trigger worm distribution. Each condition defines when and how many worms are awarded.
                </p>
              </div>
              <Button
                onClick={addCondition}
                disabled={formData.conditions.length >= 4}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Condition
              </Button>
            </div>

            {formData.conditions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No conditions added</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Add at least one condition to define when this policy should trigger worm distribution.
                  </p>
                  <Button onClick={addCondition} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Condition
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {formData.conditions.map((condition, index) => (
                  <ConditionForm
                    key={condition.id}
                    condition={condition}
                    onUpdate={(updates) => updateCondition(index, updates)}
                    onRemove={() => removeCondition(index)}
                    canRemove={formData.conditions.length > 1}
                  />
                ))}
                
                {formData.conditions.length < 4 && (
                  <Button
                    variant="outline"
                    onClick={addCondition}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Condition ({formData.conditions.length}/4)
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Review Changes</h3>
              <div className="flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Title</Label>
                      <div className="font-medium">{formData.title}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <div className="font-medium">{formData.category}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Badge>{formData.status}</Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Effective Date</Label>
                      <div className="font-medium">{new Date(formData.effectiveDate).toLocaleDateString()}</div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <div className="text-sm">{formData.description}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Conditions ({formData.conditions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {formData.conditions.map((condition, index) => (
                      <div key={condition.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Condition {index + 1}</Badge>
                          <div className="text-xs text-muted-foreground">
                            {condition.type} • {condition.requiresApproval ? 'Requires Approval' : 'Auto-approve'}
                          </div>
                        </div>
                        <div className="text-sm font-medium mb-1">{condition.description}</div>
                        <div className="text-xs text-muted-foreground mb-2">Trigger: {condition.trigger}</div>
                        <div className="text-xs">
                          Reward: {Object.entries(condition.wormReward || {})
                            .filter(([_, value]) => value && value > 0)
                            .map(([type, value]) => `${value} ${type}`)
                            .join(', ') || 'No reward'}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        <Separator />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {currentStep !== 'basic' && (
            <Button
              variant="outline"
              onClick={() => {
                const steps: Array<'basic' | 'conditions' | 'review'> = ['basic', 'conditions', 'review'];
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1]);
                }
              }}
            >
              Back
            </Button>
          )}

          {currentStep !== 'review' ? (
            <Button
              onClick={() => {
                if (currentStep === 'basic') {
                  setCurrentStep('conditions');
                } else if (currentStep === 'conditions') {
                  setCurrentStep('review');
                }
              }}
              disabled={!canProceedToNext()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !canProceedToNext()}
            >
              {isLoading ? 'Updating...' : 'Update Policy'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 