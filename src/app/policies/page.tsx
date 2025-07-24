/**
 * Policies Page
 * 
 * Next.js page component for policy management.
 * Provides bank managers with tools to create, edit, and manage
 * worm distribution policies.
 */

import { PoliciesPage } from '@/features/policies';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Policy Management | Worms Bank',
  description: 'Create and manage worm distribution policies for your organization',
};

export default function Policies() {
  return (
    <main className="min-h-screen bg-background">
      <PoliciesPage />
    </main>
  );
} 