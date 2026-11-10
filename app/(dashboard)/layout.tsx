'use client';

import { DashboardContent } from '@/app/components/dashboard-content';
import { Header } from '@/app/components/header';
import { Sidebar } from '@/app/components/sidebar';
import { SidebarProvider } from '@/app/providers/sidebar-provider';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <DashboardContent>
        <div className="min-h-screen min-w-0">
          <Header />

          <main className="px-5 py-6 sm:px-8">{children}</main>
        </div>
      </DashboardContent>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
