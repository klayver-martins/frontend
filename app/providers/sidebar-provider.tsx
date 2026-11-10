'use client';

import { SidebarContext } from '@/app/contexts/sidebar-context';
import { useState, type ReactNode } from 'react';

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);

  function toggleSidebar() {
    setIsOpen(previousState => !previousState);
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>{children}</SidebarContext.Provider>
  );
}
