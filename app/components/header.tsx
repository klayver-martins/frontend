'use client';

import { LogoutButton } from '@/app/components/logout-button';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { useSidebar } from '@/app/hooks/use-sidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function Header() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border bg-card px-5 sm:px-8">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Recolher menu lateral' : 'Mostrar menu lateral'}
        aria-expanded={isOpen}
        title={isOpen ? 'Recolher menu' : 'Mostrar menu'}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {isOpen ? (
          <PanelLeftClose size={20} strokeWidth={1.8} />
        ) : (
          <PanelLeftOpen size={20} strokeWidth={1.8} />
        )}
      </button>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
