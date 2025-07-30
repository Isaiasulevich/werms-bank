/**
 * Employee List Component
 * 
 * Data table component for displaying employees with filtering, sorting,
 * and action buttons. Includes search and department filters.
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
} from '@/components/ui';
import { useEmployeeList, useEmployees } from '../hooks';
import { Employee, EmployeeFilters, EmployeeSort, Department } from '../types';
import { formatCurrency } from '@/shared/utils/format';

interface EmployeeListProps {
  onAddEmployee?: () => void;
  onEditEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (employee: Employee) => void;
  onViewEmployee?: (employee: Employee) => void;
}

/**
 * Get department icon
 */
function getDepartmentIcon(department: Department) {
  switch (department) {
    case 'Operations':
      return 'OPS';
    case 'Engineering':
      return 'ENG';
    case 'Product':
      return 'PRD';
    case 'Marketing':
      return 'MKT';
    case 'Design':
      return 'DES';
    case 'Sales':
      return 'SAL';
    case 'Support':
      return 'SUP';
    case 'HR':
      return 'HR';
    case 'Finance':
      return 'FIN';
    case 'Legal':
      return 'LEG';
    default:
      return 'GEN';
  }
}

export function EmployeeList({
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
}: EmployeeListProps) {
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [sort, setSort] = useState<EmployeeSort>({ field: 'name', direction: 'asc' });
  const { employees, total } = useEmployeeList(filters, sort);
  const { isLoading } = useEmployees();

  /**
   * Update filters
   */
  const updateFilters = (newFilters: Partial<EmployeeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({});
  };

  /**
   * Handle sort change
   */
  const handleSort = (field: keyof Employee) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  /**
   * Get employee manager name
   */
  const getManagerName = (managerId: string | null) => {
    if (!managerId) return 'No Manager';
    const manager = employees.find(emp => emp.id === managerId);
    return manager?.name || 'Unknown Manager';
  };

  /**
   * Get filtered count text
   */
  const filteredCountText = useMemo(() => {
    const hasFilters = Object.keys(filters).some(key => filters[key as keyof EmployeeFilters]);
    if (!hasFilters) return `${total} employees`;
    return `${total} of ${employees.length} employees`;
  }, [total, employees.length, filters]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            {filteredCountText}
          </p>
          
        </div>
        {onAddEmployee && (
          <Button onClick={onAddEmployee} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="px-4 lg:px-6">
        <Card className="p-0  bg-transparent border-none shadow-none">
        
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="flex flex-col gap-2">
               
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, role..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilters({ search: e.target.value || undefined })}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div className="flex flex-col gap-2">
                
                <Select
                  value={filters.department || 'all'}
                  onValueChange={(value) => updateFilters({ department: value === 'all' ? undefined : value as Department })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="flex flex-col w-full gap-2 items-end justify-end">
                
                <Button variant="outline" onClick={clearFilters} className="w-fit">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  Employee
                  {sort.field === 'name' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('department')}
                >
                  Department
                  {sort.field === 'department' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('role')}
                >
                  Role
                  {sort.field === 'role' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('werm_balances')}
                >
                  Worm Balance
                  {sort.field === 'werm_balances' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('hire_date')}
                >
                  Hire Date
                  {sort.field === 'hire_date' && (
                    <span className="ml-1">
                      {sort.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No employees found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <img
                            src={employee.avatar_url}
                            alt={employee.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <button
                            onClick={() => onViewEmployee?.(employee)}
                            className="font-medium hover:text-primary cursor-pointer text-left"
                          >
                            {employee.name}
                          </button>
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {employee.employee_id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getDepartmentIcon(employee.department)}</span>
                        <span>{employee.department}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.role}</div>
                        <div className="text-sm text-muted-foreground">
                          Manager: {getManagerName(employee.manager_id)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {employee.werm_balances.total_werms} worms
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(employee.werm_balances.total_value_usd)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Gold: {employee.werm_balances.gold.count} | Silver: {employee.werm_balances.silver.count} | Bronze: {employee.werm_balances.bronze.count}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(employee.hire_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isLoading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onViewEmployee && (
                            <DropdownMenuItem onClick={() => onViewEmployee(employee)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          )}
                          {onEditEmployee && (
                            <DropdownMenuItem onClick={() => onEditEmployee(employee)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Employee
                            </DropdownMenuItem>
                          )}
                          {onDeleteEmployee && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDeleteEmployee(employee)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Employee
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
} 