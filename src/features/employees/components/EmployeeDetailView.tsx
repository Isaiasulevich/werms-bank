/**
 * Employee Detail View Component
 * 
 * Tabbed drawer view with directly editable fields and worm transaction history.
 * Features Overview, Transactions, and Details tabs with inline editing.
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { TrendingUp, Save, X, Receipt, Info } from 'lucide-react';
import { z } from 'zod';
import {
  Badge,
  Button,
  Separator,
  Avatar,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { useEmployees } from '../hooks';
import { Employee, EmployeePermission, Department } from '../types';
import { formatCurrency } from '@/shared/utils/format';
import { CoinIndicator } from '@/components/custom/CoinIndicator';

// Schema for transaction data
const transactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(['earn', 'spend', 'transfer', 'adjustment']),
  worm_type: z.enum(['gold', 'silver', 'bronze']),
  amount: z.number(),
  value_usd: z.number(),
  description: z.string(),
  approved_by: z.string(),
  policy_id: z.string(),
});

// Schema for worm earnings data
const wormDataSchema = z.object({
  date: z.string(),
  earned: z.number(),
  cumulative: z.number(),
});

type Transaction = z.infer<typeof transactionSchema>;
type WormDataPoint = z.infer<typeof wormDataSchema>;

interface EmployeeDetailViewProps {
  employee: Employee;
}

/**
 * Permission configuration
 */
const PERMISSION_CONFIG: Record<EmployeePermission, { icon: string; label: string; description: string }> = {
  admin: { icon: 'ADM', label: 'Admin', description: 'Full administrative access' },
  approve_distributions: { icon: 'APR', label: 'Approve Distributions', description: 'Can approve all worm distributions' },
  approve_small_distributions: { icon: 'APS', label: 'Approve Small Distributions', description: 'Can approve small worm distributions' },
  view_all_balances: { icon: 'VAB', label: 'View All Balances', description: 'Can view all employee balances' },
  view_team_balances: { icon: 'VTB', label: 'View Team Balances', description: 'Can view team member balances' },
  view_own_balance: { icon: 'VOB', label: 'View Own Balance', description: 'Can view own worm balance' },
  manage_employees: { icon: 'MNG', label: 'Manage Employees', description: 'Can manage employee accounts' },
  create_policies: { icon: 'POL', label: 'Create Policies', description: 'Can create and modify policies' },
};

/**
 * Department configuration
 */
const DEPARTMENT_CONFIG: Record<string, string> = {
  Operations: 'OPS',
  Engineering: 'ENG',
  Product: 'PRD',
  Marketing: 'MKT',
  Design: 'DES',
  Sales: 'SAL',
  Support: 'SUP',
  HR: 'HR',
  Finance: 'FIN',
  Legal: 'LEG',
};

/**
 * Generate mock worm earnings data
 */
function generateMockWormData(employee: Employee): WormDataPoint[] {
  const data: WormDataPoint[] = [];
  const currentDate = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    const baseEarnings = Math.floor(Math.random() * 10) + 2;
    const variation = Math.floor(Math.random() * 5) - 2;
    
    data.push({
      date: date.toISOString().split('T')[0],
      earned: Math.max(0, baseEarnings + variation),
      cumulative: 0,
    });
  }
  
  let cumulative = employee.lifetime_earned.total_werms - data.reduce((sum, d) => sum + d.earned, 0);
  data.forEach(d => {
    cumulative += d.earned;
    d.cumulative = cumulative;
  });
  
  return data;
}

/**
 * Generate mock transaction data
 */
function generateMockTransactions(employee: Employee): Transaction[] {
  const transactions: Transaction[] = [];
  const currentDate = new Date();
  
  const types: Transaction['type'][] = ['earn', 'spend', 'transfer', 'adjustment'];
  const wormTypes: Transaction['worm_type'][] = ['gold', 'silver', 'bronze'];
  const categories = ['Performance', 'Weekly Recognition', 'Project Completion', 'Team Achievement', 'Monthly Bonus'];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    
    const wormType = wormTypes[Math.floor(Math.random() * wormTypes.length)];
    const amount = Math.floor(Math.random() * 10) + 1;
    const multiplier = wormType === 'gold' ? 10 : wormType === 'silver' ? 3 : 1;
    
    transactions.push({
      id: `txn-${i}`,
      date: date.toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      worm_type: wormType,
      amount,
      value_usd: amount * multiplier,
      description: categories[Math.floor(Math.random() * categories.length)],
      approved_by: 'Isa',
      policy_id: 'pol-001',
    });
  }
  
  return transactions;
}

/**
 * Get permission display info
 */
function getPermissionInfo(permission: EmployeePermission) {
  return PERMISSION_CONFIG[permission] || { icon: '❓', label: permission, description: 'Unknown permission' };
}

/**
 * Get department icon
 */
function getDepartmentIcon(department: string) {
  return DEPARTMENT_CONFIG[department] || '👤';
}

/**
 * Header component with save/cancel controls
 */
function EmployeeHeader({ 
  employee, 
  editedData, 
  hasChanges, 
  isLoading,
  onSave, 
  onCancel 
}: {
  employee: Employee;
  editedData: Employee;
  hasChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col text-center w-full items-center gap-4">
        <Avatar className="h-16 w-16 border-1  border-primary">
          <img
            src={employee.avatar_url}
            alt={employee.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{editedData.name}</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {getDepartmentIcon(editedData.department)} {editedData.department} • {editedData.role}
          </div>
          <div className="text-xs text-muted-foreground">
            {editedData.employee_id}
          </div>
        </div>
      </div>
      
      {hasChanges && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-1" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Overview tab content
 */
function OverviewTab({ employee, wormData }: { employee: Employee; wormData: WormDataPoint[] }) {
  const maxEarnings = Math.max(...wormData.map(d => d.earned));

  return (
    <div className="space-y-6">
      {/* Worm Balances */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-4">Current Balance</h3>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center flex flex-col items-center gap-2">
            <CoinIndicator value={employee.werm_balances.gold.count} type="gold" />
            <div className="text-xs text-muted-foreground">Gold</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(employee.werm_balances.gold.total_value)}
            </div>
          </div>
          <div className="text-center flex flex-col items-center gap-2">
            <CoinIndicator value={employee.werm_balances.silver.count} type="silver" />
            <div className="text-xs text-muted-foreground">Silver</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(employee.werm_balances.silver.total_value)}
            </div>
          </div>
          <div className="text-center flex flex-col items-center gap-2">
            <CoinIndicator value={employee.werm_balances.bronze.count} type="bronze" />
            <div className="text-xs text-muted-foreground">Bronze</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(employee.werm_balances.bronze.total_value)}
            </div>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="text-center p-4 bg-muted/50 rounded-lg mb-6">
          <div className="text-2xl font-bold">{employee.lifetime_earned.total_werms}</div>
          <div className="text-sm text-muted-foreground">Total Worms Earned</div>
          <div className="text-lg font-medium">
            {formatCurrency(employee.lifetime_earned.total_value_usd)}
          </div>
        </div>

        {/* Earnings Chart */}
        <div>
          <div className="text-xs text-muted-foreground mb-3">Werm Earnings - Last 7 Days</div>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                earned: {
                  label: "Werms Earned",
                  color: "hsl(var(--primary))",
                },
              } satisfies ChartConfig}
              className="h-full w-full"
            >
              <BarChart
                accessibilityLayer
                data={wormData.slice(-7)}
                layout="vertical"
                margin={{
                  left: 0,
                  right: 40,
                }}
              >
                <XAxis type="number" dataKey="earned" hide />
                <YAxis
                  dataKey="date"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={50}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        });
                      }}
                      formatter={(value, name) => [
                        `${value} werms`,
                        name === "earned" ? "Earned" : name
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="earned"
                  fill="hsl(var(--chart-1))"
                  radius={5}
                >
                  <LabelList 
                    dataKey="earned" 
                    position="right"
                    offset={8}
                    fontSize={12}
                    className="fill-foreground font-medium"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-3 text-xs text-muted-foreground text-center">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Trending up 8.2% this month
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Transactions tab content
 */
function TransactionsTab({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Recent worm transactions and distributions
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Approved By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-sm">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={transaction.type === 'earn' ? 'default' : 'outline'}>
                                            {transaction.type === 'earn' ? '+' : '-'} {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CoinIndicator value={transaction.amount} type={transaction.worm_type} size="xs" animate={false} />
                    <span className="font-medium">
                      {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({formatCurrency(transaction.value_usd)})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{transaction.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {transaction.approved_by}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Details tab content
 */
function DetailsTab({ 
  editedData, 
  updateField,
  directReports
}: {
  editedData: Employee;
  updateField: <K extends keyof Employee>(field: K, value: Employee[K]) => void;
  directReports: Employee[];
}) {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-4">Contact Information</h3>
        <form className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={editedData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="h-8 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              value={editedData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="h-8 mt-1"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Slack Username</Label>
            <Input
              value={editedData.slack_username}
              onChange={(e) => updateField('slack_username', e.target.value)}
              className="h-8 mt-1"
            />
          </div>
        </form>
      </div>

      <Separator />

      {/* Work Information */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-4">Work Information</h3>
        <form className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Department</Label>
            <Select
              value={editedData.department}
              onValueChange={(value) => updateField('department', value as Department)}
            >
              <SelectTrigger className="h-8 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operations">⚡ Operations</SelectItem>
                <SelectItem value="Engineering">👨‍💻 Engineering</SelectItem>
                <SelectItem value="Product">📱 Product</SelectItem>
                <SelectItem value="Marketing">📢 Marketing</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Support">🛟 Support</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Legal">⚖️ Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Role</Label>
            <Input
              value={editedData.role}
              onChange={(e) => updateField('role', e.target.value)}
              className="h-8 mt-1"
            />
          </div>
        </form>
      </div>

      <Separator />

      {/* Direct Reports */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-4">Direct Reports ({directReports.length})</h3>
        <div className="mt-2 space-y-2">
          {directReports.length > 0 ? (
            directReports.map((report) => (
              <div key={report.id} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <img src={report.avatar_url} alt={report.name} className="h-6 w-6 rounded-full object-cover" />
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{report.name}</div>
                  <div className="text-xs text-muted-foreground">{report.role}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No direct reports</div>
          )}
        </div>
      </div>

      <Separator />

      {/* Permissions */}
      <div>
        <h3 className="font-medium text-sm text-muted-foreground mb-4">
          Permissions ({editedData.permissions.length})
        </h3>
        <div className="space-y-2">
          {editedData.permissions.map((permission) => {
            const permissionInfo = getPermissionInfo(permission);
            return (
              <div key={permission} className="flex items-center gap-3 p-2 border rounded text-sm">
                <span>{permissionInfo.icon}</span>
                <div>
                  <div className="font-medium">{permissionInfo.label}</div>
                  <div className="text-xs text-muted-foreground">{permissionInfo.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function EmployeeDetailView({ employee }: EmployeeDetailViewProps) {
  const { updateEmployee, isLoading, getEmployeesByManager } = useEmployees();
  
  // Editing state
  const [editedData, setEditedData] = useState(employee);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - memoized for performance
  const wormData = useMemo(() => generateMockWormData(employee), [employee]);
  const transactions = useMemo(() => generateMockTransactions(employee), [employee]);

  // Direct reports - memoized for performance
  const directReports = useMemo(() => {
    return getEmployeesByManager(employee.id);
  }, [employee.id, getEmployeesByManager]);

  // Reset data when employee changes
  useEffect(() => {
    setEditedData(employee);
    setHasChanges(false);
  }, [employee]);

  /**
   * Update field and track changes
   */
  const updateField = useCallback(<K extends keyof Employee>(field: K, value: Employee[K]) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  /**
   * Save changes
   */
  const handleSave = useCallback(async () => {
    try {
      await updateEmployee(employee.id, editedData);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  }, [employee.id, editedData, updateEmployee]);

  /**
   * Cancel changes
   */
  const handleCancel = useCallback(() => {
    setEditedData(employee);
    setHasChanges(false);
  }, [employee]);

  return (
    <div className="flex flex-col gap-6 min-h-0">
      {/* Header */}
      <EmployeeHeader
        employee={employee}
        editedData={editedData}
        hasChanges={hasChanges}
        isLoading={isLoading}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <Separator />

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
       
            Transactions
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
           
            Details
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0">
          <TabsContent value="overview" className="mt-0 h-full">
            <OverviewTab employee={employee} wormData={wormData} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-0 h-full">
            <TransactionsTab transactions={transactions} />
          </TabsContent>

          <TabsContent value="details" className="mt-0 h-full">
            <DetailsTab
              editedData={editedData}
              updateField={updateField}
              directReports={directReports}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 