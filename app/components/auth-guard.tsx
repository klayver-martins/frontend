'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { getProfileService } from '@/app/services/user/get-profile-service';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function validateSession() {
      try {
        await getProfileService();

        if (active) {
          setIsAuthenticated(true);
        }
      } catch {
        if (active && window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      }
    }

    void validateSession();

    return () => {
      active = false;
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Verificando sua sessão...</p>
        </div>
      </div>
    );
  }

  return children;
}
