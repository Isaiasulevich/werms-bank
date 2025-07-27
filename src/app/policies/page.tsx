/**
 * Policies Page
 * 
 * Next.js page component for policy management.
 * Provides bank managers with tools to create, edit, and manage
 * worm distribution policies.
 */

import { DashboardLayout } from '@/components/dashboard-layout';
import { PoliciesPage } from '@/features/policies';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Policy Management | Worms Bank',
  description: 'Create and manage worm distribution policies for your organization',
};

export default function Policies() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Policies Content */}
        <PoliciesPage />
      </div>
    </DashboardLayout>
  );
} 