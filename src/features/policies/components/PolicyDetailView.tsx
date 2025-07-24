/**
 * Policy Detail View Component
 * 
 * Comprehensive view of policy information with progressive disclosure.
 * Shows policy details, conditions, history, and related actions.
 */

'use client';

import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Calendar, User, Shield, Clock, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Policy, PolicyCondition } from '../types';

interface PolicyDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy | null;
  onEdit: (policy: Policy) => void;
  onDelete: (policy: Policy) => void;
}

/**
 * Condition detail card component
 */
function ConditionCard({ condition, index }: { condition: PolicyCondition; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Get condition type info
   */
  function getConditionTypeInfo(type: string) {
    switch (type) {
      case 'attendance':
        return { 
          name: 'Attendance', 
          icon: '⏰', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          description: 'Triggers based on employee attendance patterns'
        };
      case 'performance':
        return { 
          name: 'Performance', 
          icon: '📈', 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          description: 'Triggers based on performance metrics and achievements'
        };
      case 'milestone':
        return { 
          name: 'Milestone', 
          icon: '🎯', 
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          description: 'Triggers based on project milestones and goal completion'
        };
      case 'custom':
        return { 
          name: 'Custom', 
          icon: '⚙️', 
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          description: 'Custom or automated trigger conditions'
        };
      default:
        return { 
          name: type, 
          icon: '📄', 
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          description: 'Standard policy condition'
        };
    }
  }

  /**
   * Format worm reward
   */
  function formatWormReward() {
    const { gold = 0, silver = 0, bronze = 0 } = condition.wormReward || {};
    const parts = [];
    if (gold > 0) parts.push(`${gold} 🥇 Gold`);
    if (silver > 0) parts.push(`${silver} 🥈 Silver`);
    if (bronze > 0) parts.push(`${bronze} 🥉 Bronze`);
    return parts.length > 0 ? parts.join(', ') : 'No reward set';
  }

  const typeInfo = getConditionTypeInfo(condition.type);

  return (
    <Card className={`${typeInfo.borderColor} ${condition.isActive ? '' : 'opacity-60'}`}>
      <CardHeader 
        className={`${typeInfo.bgColor} cursor-pointer transition-colors hover:opacity-80`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{typeInfo.icon}</span>
              <div>
                <CardTitle className={`text-base ${typeInfo.color}`}>
                  Condition {index + 1}: {typeInfo.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {typeInfo.description}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {condition.isActive ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                Inactive
              </Badge>
            )}
            {condition.requiresApproval && (
              <Badge variant="outline" className="text-xs">
                Approval Required
              </Badge>
            )}
          </div>
        </div>
        
        {!isExpanded && (
          <div className="mt-2">
            <p className="text-sm text-gray-700 line-clamp-2">{condition.description}</p>
            <div className="mt-1 text-xs text-gray-600">
              Reward: {formatWormReward()}
            </div>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4">
            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Description</h4>
              <p className="text-sm text-gray-700">{condition.description}</p>
            </div>

            {/* Trigger */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">Trigger Condition</h4>
              <p className="text-sm text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded">
                {condition.trigger}
              </p>
            </div>

            {/* Rewards */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Worm Rewards</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'Gold', value: condition.wormReward?.gold || 0, icon: '🥇', color: 'text-yellow-600' },
                  { type: 'Silver', value: condition.wormReward?.silver || 0, icon: '🥈', color: 'text-gray-500' },
                  { type: 'Bronze', value: condition.wormReward?.bronze || 0, icon: '🥉', color: 'text-amber-600' }
                ].map((reward) => (
                  <div key={reward.type} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg mb-1">{reward.icon}</div>
                    <div className={`text-sm font-medium ${reward.color}`}>{reward.value}</div>
                    <div className="text-xs text-gray-500">{reward.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                {condition.requiresApproval ? (
                  <CheckCircle className="h-3 w-3 text-orange-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-gray-400" />
                )}
                <span>Requires Approval</span>
              </div>
              <div className="flex items-center gap-1">
                {condition.isActive ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                <span>Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function PolicyDetailView({ open, onOpenChange, policy, onEdit, onDelete }: PolicyDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  /**
   * Get category display info
   */
  function getCategoryInfo(category: string) {
    switch (category) {
      case 'distribution':
        return { name: 'Distribution', icon: '🏦', color: 'text-blue-600', description: 'Manages worm allocation and distribution' };
      case 'minting':
        return { name: 'Minting', icon: '⚡', color: 'text-yellow-600', description: 'Controls worm creation and minting' };
      case 'recognition':
        return { name: 'Recognition', icon: '🏆', color: 'text-green-600', description: 'Employee rewards and recognition' };
      case 'compliance':
        return { name: 'Compliance', icon: '📋', color: 'text-purple-600', description: 'Ensures policy compliance and adherence' };
      default:
        return { name: category, icon: '📄', color: 'text-gray-600', description: 'General policy category' };
    }
  }

  /**
   * Get status info
   */
  function getStatusInfo(status: string) {
    switch (status) {
      case 'active':
        return { name: 'Active', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
      case 'inactive':
        return { name: 'Inactive', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: XCircle };
      case 'draft':
        return { name: 'Draft', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: AlertCircle };
      default:
        return { name: status, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle };
    }
  }

  /**
   * Get total rewards across all conditions
   */
  function getTotalRewards() {
    const totals = { gold: 0, silver: 0, bronze: 0 };
    
    policy?.conditions.forEach(condition => {
      if (condition.wormReward) {
        totals.gold += condition.wormReward.gold || 0;
        totals.silver += condition.wormReward.silver || 0;
        totals.bronze += condition.wormReward.bronze || 0;
      }
    });

    return totals;
  }

  if (!policy) return null;

  const categoryInfo = getCategoryInfo(policy.category);
  const statusInfo = getStatusInfo(policy.status);
  const totalRewards = getTotalRewards();
  const activeConditions = policy.conditions.filter(c => c.isActive).length;
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <div>
                  <DialogTitle className="text-left text-xl">{policy.title}</DialogTitle>
                  <DialogDescription className="text-left">
                    {categoryInfo.name} Policy • Created by {policy.createdBy.name}
                  </DialogDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={policy.status === 'active' ? 'default' : 'secondary'} className={statusInfo.bgColor}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.name}
              </Badge>
              {policy.isSystemPolicy && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  <Shield className="h-3 w-3 mr-1" />
                  System Policy
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="flex flex-col gap-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-blue-600">{policy.conditions.length}</div>
                    <div className="text-xs text-muted-foreground">Total Conditions</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-green-600">{activeConditions}</div>
                    <div className="text-xs text-muted-foreground">Active Conditions</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {totalRewards.gold + totalRewards.silver + totalRewards.bronze}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Rewards</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor((Date.now() - new Date(policy.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Active</div>
                  </CardContent>
                </Card>
              </div>

              {/* Policy Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Policy Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{policy.description}</p>
                </CardContent>
              </Card>

              {/* Reward Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Reward Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl mb-2">🥇</div>
                      <div className="text-2xl font-bold text-yellow-600">{totalRewards.gold}</div>
                      <div className="text-sm text-yellow-700">Gold Worms</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl mb-2">🥈</div>
                      <div className="text-2xl font-bold text-gray-600">{totalRewards.silver}</div>
                      <div className="text-sm text-gray-700">Silver Worms</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-3xl mb-2">🥉</div>
                      <div className="text-2xl font-bold text-amber-600">{totalRewards.bronze}</div>
                      <div className="text-sm text-amber-700">Bronze Worms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conditions Tab */}
          <TabsContent value="conditions" className="mt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Policy Conditions</h3>
                  <p className="text-sm text-muted-foreground">
                    {policy.conditions.length} total condition{policy.conditions.length !== 1 ? 's' : ''}, {activeConditions} active
                  </p>
                </div>
              </div>

              {policy.conditions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {policy.conditions.map((condition, index) => (
                    <ConditionCard
                      key={condition.id}
                      condition={condition}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Conditions</h3>
                    <p className="text-muted-foreground text-center">
                      This policy doesn't have any conditions defined.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <div className="flex flex-col gap-6">
              {/* Policy Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Policy Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <span>{categoryInfo.icon}</span>
                        <span className="font-medium">{categoryInfo.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {categoryInfo.description}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                        <span className="font-medium">{statusInfo.name}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Effective Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(policy.effectiveDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Expiration Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {policy.expirationDate ? 
                            new Date(policy.expirationDate).toLocaleDateString() : 
                            'No expiration'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Audit Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-xs text-muted-foreground">Created By</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{policy.createdBy.name}</div>
                          <div className="text-xs text-muted-foreground">{policy.createdBy.role}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Created Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(policy.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Modified</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(policy.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Policy Type</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {policy.isSystemPolicy ? 'System Policy' : 'Custom Policy'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Policies
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={() => onEdit(policy)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Policy
            </Button>
            {!policy.isSystemPolicy && (
              <Button 
                variant="destructive" 
                onClick={() => onDelete(policy)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
} 