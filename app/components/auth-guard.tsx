'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { SESSION_EXPIRED_EVENT } from '@/app/services/api-client';
import { getProfileService } from '@/app/services/user/get-profile-service';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    const handleSessionExpired = () => {
      router.replace('/login');
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    async function validateSession() {
      try {
        await getProfileService();

        if (active) {
          setIsAuthenticated(true);
        }
      } catch {
        if (active) {
          router.replace('/login');
        }
      }
    }

    void validateSession();

    return () => {
      active = false;
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Carregando aguarde um momento...</p>
        </div>
      </div>
    );
  }

  return children;
}
