'use client';

import { useSidebar } from '@/app/hooks/use-sidebar';
import type { ReactNode } from 'react';

interface DashboardContentProps {
  children: ReactNode;
}

export function DashboardContent({ children }: DashboardContentProps) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`min-h-screen min-w-0 transition-[margin] duration-300 ease-in-out ${
        isOpen ? 'md:ml-64' : 'md:ml-0'
      }`}
    >
      {children}
    </div>
  );
}
