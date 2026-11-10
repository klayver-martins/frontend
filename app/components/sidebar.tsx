'use client';

import { useSidebar } from '@/app/hooks/use-sidebar';
import { House, Package, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { label: 'Início', href: '/home', icon: House },
  { label: 'Produtos', href: '/products', icon: Package },
  { label: 'Perfil', href: '/profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  return (
    <aside
      aria-hidden={!isOpen}
      className={`flex w-full flex-col border-b border-border bg-card transition-all duration-300 ease-in-out md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-r md:border-b-0 ${
        isOpen
          ? 'flex translate-x-0 opacity-100'
          : 'hidden -translate-x-full opacity-0 pointer-events-none md:flex'
      }`}
    >
      <nav
        aria-label="Navegação principal"
        className="flex flex-row gap-2 overflow-x-auto p-3 md:flex-col md:gap-1.5 md:p-4 md:pt-8"
      >
        <p className="mb-3 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground md:block">
          Menu principal
        </p>

        {navigationItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={isOpen ? 0 : -1}
              className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 md:w-full ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />

              <span>{item.label}</span>

              {isActive && (
                <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-primary md:block" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
