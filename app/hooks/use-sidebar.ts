'use client';

import { SidebarContext } from '@/app/contexts/sidebar-context';
import { useContext } from 'react';

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar deve ser utilizado dentro de SidebarProvider.');
  }

  return context;
}
