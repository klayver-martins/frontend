'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/app/hooks/use-theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Ativar tema ${isDark ? 'claro' : 'escuro'}`}
      title={`Ativar tema ${isDark ? 'claro' : 'escuro'}`}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? <Sun size={19} strokeWidth={1.8} /> : <Moon size={19} strokeWidth={1.8} />}
    </button>
  );
}
