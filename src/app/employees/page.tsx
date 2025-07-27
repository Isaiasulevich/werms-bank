/**
 * Employees Page
 * 
 * Next.js page component for employee management.
 * Provides bank managers with tools to manage employee records,
 * worm distributions, and performance tracking.
 */

import { DashboardLayout } from '@/components/dashboard-layout';
import { EmployeesPage } from '@/features/employees';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Management | Worms Bank',
  description: 'Manage employee records and worm distributions for your organization',
};

export default function Employees() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        

        {/* Employees Content */}
        <EmployeesPage />
      </div>
    </DashboardLayout>
  );
} 