/**
 * Employees Page Route
 * 
 * Main page for employee management accessible at /employees
 */

import { DashboardLayout } from '@/components/dashboard-layout';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Plus, Users } from 'lucide-react';

export default function EmployeesPageRoute() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage employee accounts, permissions, and worm balances.
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Content */}
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Management
              </CardTitle>
              <CardDescription>
                View and manage employee accounts, worm balances, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Employee management interface will be restored shortly.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Working on fixing component compilation issues...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export const metadata = {
  title: 'Employees - Worm Bank',
  description: 'Manage employee accounts, permissions, and worm balances.',
}; 