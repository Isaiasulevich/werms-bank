/**
 * Add Employee Dialog Component
 * 
 * Modal dialog for creating new employees with progressive disclosure.
 * Includes form validation, permission management, and intuitive UX.
 */

'use client';

import { useState, useCallback } from 'react';
import { Plus, X, AlertCircle, Info, User, Building, Shield } from 'lucide-react';
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
import { useEmployees, useEmployeeForm } from '../hooks';
import { Department, EmployeePermission } from '../types';

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Permission categories for better organization
 */
const permissionCategories = {
  'Basic Access': [
    { value: 'view_own_balance' as const, label: 'View Own Balance', description: 'Can view their own worm balance and transactions' },
  ],
  'Team Management': [
    { value: 'view_team_balances' as const, label: 'View Team Balances', description: 'Can view balances of team members' },
    { value: 'manage_employees' as const, label: 'Manage Employees', description: 'Can add, edit, and manage employee accounts' },
  ],
  'Administrative': [
    { value: 'view_all_balances' as const, label: 'View All Balances', description: 'Can view all employee balances across the organization' },
    { value: 'approve_small_distributions' as const, label: 'Approve Small Distributions', description: 'Can approve small worm distributions (up to 10 worms)' },
    { value: 'approve_distributions' as const, label: 'Approve Distributions', description: 'Can approve all worm distributions' },
    { value: 'create_policies' as const, label: 'Create Policies', description: 'Can create and modify distribution policies' },
    { value: 'admin' as const, label: 'Full Admin Access', description: 'Complete administrative access to all features' },
  ],
};

export function AddEmployeeDialog({ open, onOpenChange }: AddEmployeeDialogProps) {
  const { createEmployee, isLoading, getPotentialManagers } = useEmployees();
  const { formData, updateFormData, resetForm } = useEmployeeForm();
  const [currentStep, setCurrentStep] = useState<'basic' | 'work' | 'permissions' | 'review'>('basic');
  const potentialManagers = getPotentialManagers();

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    try {
      // Create the employee
      await createEmployee(formData);
      
      // Reset form and close dialog
      resetForm();
      setCurrentStep('basic');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create employee:', error);
      // Error handling would go here (toast notification, etc.)
    }
  }, [formData, createEmployee, resetForm, onOpenChange]);

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
        return formData.name.trim().length > 0 && 
               formData.email.trim().length > 0 && 
               formData.slack_username.trim().length > 0;
      case 'work':
        return formData.department && formData.role.trim().length > 0 && formData.hire_date;
      case 'permissions':
        return formData.permissions.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  /**
   * Toggle permission
   */
  const togglePermission = useCallback((permission: EmployeePermission) => {
    const currentPermissions = formData.permissions;
    const hasPermission = currentPermissions.includes(permission);
    
    if (hasPermission) {
      updateFormData({
        permissions: currentPermissions.filter(p => p !== permission)
      });
    } else {
      updateFormData({
        permissions: [...currentPermissions, permission]
      });
    }
  }, [formData.permissions, updateFormData]);

  /**
   * Auto-suggest slack username from email
   */
  const handleEmailChange = useCallback((email: string) => {
    updateFormData({ email });
    
    // Auto-suggest slack username if not already set
    if (!formData.slack_username && email.includes('@')) {
      const username = email.split('@')[0];
      updateFormData({ slack_username: `@${username}` });
    }
  }, [formData.slack_username, updateFormData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create a new employee account with appropriate permissions and access levels.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <Badge variant={currentStep === 'basic' ? 'default' : 'secondary'}>
            1. Basic Info
          </Badge>
          <div className="h-px bg-border flex-1" />
          <Badge variant={currentStep === 'work' ? 'default' : 'secondary'}>
            2. Work Details
          </Badge>
          <div className="h-px bg-border flex-1" />
          <Badge variant={currentStep === 'permissions' ? 'default' : 'secondary'}>
            3. Permissions
          </Badge>
          <div className="h-px bg-border flex-1" />
          <Badge variant={currentStep === 'review' ? 'default' : 'secondary'}>
            4. Review
          </Badge>
        </div>

        {/* Basic Information Step */}
        {currentStep === 'basic' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-name">Full Name *</Label>
                <Input
                  id="employee-name"
                  placeholder="e.g., John Smith"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-email">Email Address *</Label>
                <Input
                  id="employee-email"
                  type="email"
                  placeholder="e.g., john.smith@nakatomi.com"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-slack">Slack Username *</Label>
                <Input
                  id="employee-slack"
                  placeholder="e.g., @johnsmith"
                  value={formData.slack_username}
                  onChange={(e) => updateFormData({ slack_username: e.target.value })}
                />
                <div className="text-xs text-muted-foreground">
                  Must start with @ and match their Slack display name
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-phone">Phone Number (Optional)</Label>
                <Input
                  id="employee-phone"
                  type="tel"
                  placeholder="e.g., +1 (555) 123-4567"
                  value={formData.phone || ''}
                  onChange={(e) => updateFormData({ phone: e.target.value || undefined })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-bio">Bio (Optional)</Label>
                <Textarea
                  id="employee-bio"
                  placeholder="Brief description about the employee..."
                  value={formData.bio || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData({ bio: e.target.value || undefined })}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Work Details Step */}
        {currentStep === 'work' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-5 w-5" />
              <h3 className="text-lg font-medium">Work Details</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="employee-department">Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => updateFormData({ department: value as Department })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">⚡ Operations</SelectItem>
                      <SelectItem value="Engineering">👨‍💻 Engineering</SelectItem>
                      <SelectItem value="Product">📱 Product</SelectItem>
                      <SelectItem value="Marketing">📢 Marketing</SelectItem>
                      <SelectItem value="Design">🎨 Design</SelectItem>
                      <SelectItem value="Sales">💼 Sales</SelectItem>
                      <SelectItem value="Support">🛟 Support</SelectItem>
                      <SelectItem value="HR">👥 HR</SelectItem>
                      <SelectItem value="Finance">💰 Finance</SelectItem>
                      <SelectItem value="Legal">⚖️ Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-role">Job Title *</Label>
                <Input
                  id="employee-role"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.role}
                  onChange={(e) => updateFormData({ role: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="employee-hire-date">Hire Date *</Label>
                  <Input
                    id="employee-hire-date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => updateFormData({ hire_date: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="employee-manager">Manager</Label>
                  <Select 
                    value={formData.manager_id || 'none'} 
                    onValueChange={(value) => updateFormData({ manager_id: value === 'none' ? null : value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Manager</SelectItem>
                      {potentialManagers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} - {manager.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="employee-location">Location (Optional)</Label>
                <Input
                  id="employee-location"
                  placeholder="e.g., New York, NY"
                  value={formData.location || ''}
                  onChange={(e) => updateFormData({ location: e.target.value || undefined })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Permissions Step */}
        {currentStep === 'permissions' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5" />
              <h3 className="text-lg font-medium">Access Permissions</h3>
            </div>

            <div className="flex flex-col gap-6">
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-base">{category}</CardTitle>
                    <CardDescription>
                      {category === 'Basic Access' && 'Essential permissions for all employees'}
                      {category === 'Team Management' && 'Permissions for managing team members and operations'}
                      {category === 'Administrative' && 'Advanced permissions for administrators and managers'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {permissions.map((permission) => (
                      <div key={permission.value} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.value}
                          checked={formData.permissions.includes(permission.value)}
                          onCheckedChange={() => togglePermission(permission.value)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={permission.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {formData.permissions.length === 0 && (
              <Card className="border-destructive">
                <CardContent className="flex items-center gap-2 pt-6">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <div className="text-sm text-destructive">
                    Please select at least one permission to continue.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-5 w-5" />
              <h3 className="text-lg font-medium">Review Employee Details</h3>
            </div>

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <div className="font-medium">{formData.name}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="font-medium">{formData.email}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Slack Username</Label>
                    <div className="font-medium">{formData.slack_username}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Employee ID</Label>
                    <div className="font-medium">{formData.employee_id}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Work Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Department</Label>
                    <div className="font-medium">{formData.department}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <div className="font-medium">{formData.role}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Hire Date</Label>
                    <div className="font-medium">{new Date(formData.hire_date).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Permissions ({formData.permissions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.permissions.map((permission) => (
                      <Badge key={permission} variant="outline">
                        {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                const steps: Array<'basic' | 'work' | 'permissions' | 'review'> = ['basic', 'work', 'permissions', 'review'];
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
                  setCurrentStep('work');
                } else if (currentStep === 'work') {
                  setCurrentStep('permissions');
                } else if (currentStep === 'permissions') {
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
              {isLoading ? 'Creating...' : 'Create Employee'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 