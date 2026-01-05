'use client';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/use-auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Check auth on mount
  useAuth();
  return <DashboardLayout>{children}</DashboardLayout>;
}

