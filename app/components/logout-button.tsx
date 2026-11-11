'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/app/services/api';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/logout');

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Não foi possível encerrar a sessão.');
      }

      router.replace('/login');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível encerrar a sessão.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => handleLogout()}
        disabled={isLoading}
        title="Sair"
        aria-label="Sair da conta"
        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LogOut size={18} />
        <span>{isLoading ? 'Saindo...' : 'Sair'}</span>
      </button>

      {error && (
        <p
          role="alert"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-destructive/30 bg-card p-3 text-sm text-destructive shadow-lg"
        >
          {error}
        </p>
      )}
    </div>
  );
}
