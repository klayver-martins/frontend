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
      {/* Logo */}
      <div className="hidden items-center gap-3 border-b border-border px-6 py-6 md:flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          fill="none"
          className="h-11 w-11 shrink-0"
        >
          <defs>
            <linearGradient id="sidebar-logo-gradient" x1="8" y1="8" x2="56" y2="56">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          <rect x="3" y="3" width="58" height="58" rx="19" fill="url(#sidebar-logo-gradient)" />

          <path
            d="M32 14L48 23V41L32 50L16 41V23L32 14Z"
            stroke="white"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />

          <path
            d="M16.5 23.5L32 32.5L47.5 23.5M32 32.5V49.5M24 18.5L40 27.5"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="45" cy="45" r="5" fill="white" />

          <path
            d="M43 45L44.5 46.5L47.5 43.5"
            stroke="var(--primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="min-w-0">
          <h2 className="truncate text-base font-bold tracking-tight text-foreground">Manager</h2>
          <p className="text-xs text-muted-foreground">Gestão de produtos</p>
        </div>
      </div>

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
