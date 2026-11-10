'use client';

import { useContext } from 'react';

import { ThemeContext } from '@/app/contexts/theme-context';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de ThemeProvider.');
  }

  return context;
}
