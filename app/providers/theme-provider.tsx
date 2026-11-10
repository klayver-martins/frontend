'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

import { ThemeContext, type Theme } from '@/app/contexts/theme-context';

interface ThemeProviderProps {
  children: ReactNode;
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): Theme {
  return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);
    document.documentElement.dataset.mode = newTheme;

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'theme',
        newValue: newTheme,
      }),
    );
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
