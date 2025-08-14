/**
 * Policy List Component
 * 
 * Displays a comprehensive list of policies with filtering, sorting,
 * and action capabilities. Includes policy statistics and quick actions.
 */

'use client';

import { useState } from 'react';
import { MoreHorizontal, Plus, Filter, Search, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { usePolicies, usePolicyStats } from '../hooks';
import { Policy, PolicyCategory, PolicyStatus } from '../types';

interface PolicyListProps {
  onCreatePolicy: () => void;
  onEditPolicy: (policy: Policy) => void;
  onViewPolicy: (policy: Policy) => void;
  onDeletePolicy: (policy: Policy) => void;
}

export function PolicyList({ 
  onCreatePolicy, 
  onEditPolicy, 
  onViewPolicy, 
  onDeletePolicy 
}: PolicyListProps) {
  const { policies, isLoading } = usePolicies();
  const { stats } = usePolicyStats();
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PolicyCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'all'>('all');

  // Filter policies based on search and filters
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  /**
   * Get badge variant based on policy status
   */
  function getStatusVariant(status: PolicyStatus) {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  /**
   * Get category display name and icon
   */
  function getCategoryInfo(category: PolicyCategory) {
    switch (category) {
      case 'distribution':
        return { name: 'Distribution', icon: '🏦' };
      case 'minting':
        return { name: 'Minting', icon: '⚡' };
      case 'recognition':
        return { name: 'Recognition', icon: 'REC' };
      case 'compliance':
        return { name: 'Compliance', icon: 'COM' };
      case 'performance':
        return { name: 'Performance', icon: 'PERF' };
      default:
        return { name: category, icon: '📄' };
    }
  }

  /**
   * Format condition count for display
   */
  function formatConditionCount(count: number) {
    return `${count} condition${count !== 1 ? 's' : ''}`;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Policy Management</h1>
            <p className="text-muted-foreground">
              Create and manage worm distribution policies for your organization
            </p>
          </div>
          <Button onClick={onCreatePolicy} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Policy
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPolicies}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{stats.activePolicies}</div>
              <p className="text-xs text-muted-foreground">
                Currently enforced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Triggered Today</CardTitle>
              <Clock className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-2">{stats.triggeredToday}</div>
              <p className="text-xs text-muted-foreground">
                Policy executions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Worms Distributed</CardTitle>
              <AlertCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">{stats.totalWormDistributed}</div>
              <p className="text-xs text-muted-foreground">
                Total today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as PolicyCategory | 'all')}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
                <SelectItem value="minting">Minting</SelectItem>
                <SelectItem value="recognition">Recognition</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                 <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PolicyStatus | 'all')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Policy Table */}
      <Card>
        <CardHeader>
          <CardTitle>Policies ({filteredPolicies.length})</CardTitle>
          <CardDescription>
            {filteredPolicies.length === 0 && searchTerm ? 
              `No policies found matching "${searchTerm}"` : 
              'Manage your organization\'s worm distribution policies'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPolicies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => {
                  const categoryInfo = getCategoryInfo(policy.category);
                  
                  return (
                    <TableRow key={policy.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={() => onViewPolicy(policy)}>
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">{policy.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {policy.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => onViewPolicy(policy)}>
                        <div className="flex items-center gap-2">
                          <span>{categoryInfo.icon}</span>
                          <span className="text-sm">{categoryInfo.name}</span>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => onViewPolicy(policy)}>
                        <Badge variant={getStatusVariant(policy.status)}>
                          {policy.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={() => onViewPolicy(policy)}>
                        <span className="text-sm text-muted-foreground">
                          {formatConditionCount(policy.conditions.length)}
                        </span>
                      </TableCell>
                      <TableCell onClick={() => onViewPolicy(policy)}>
                        <div className="text-sm">
                          <div>{policy.createdBy.name}</div>
                          <div className="text-muted-foreground">{policy.createdBy.role}</div>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => onViewPolicy(policy)}>
                        <span className="text-sm text-muted-foreground">
                          {new Date(policy.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewPolicy(policy)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditPolicy(policy)}>
                              Edit Policy
                            </DropdownMenuItem>
                            {!policy.isSystemPolicy && (
                              <DropdownMenuItem 
                                onClick={() => onDeletePolicy(policy)}
                                className="text-destructive"
                              >
                                Delete Policy
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No policies found</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ?
                  'Try adjusting your search criteria or filters.' :
                  'Get started by creating your first policy.'
                }
              </p>
              {(!searchTerm && categoryFilter === 'all' && statusFilter === 'all') && (
                <Button onClick={onCreatePolicy} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Policy
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 