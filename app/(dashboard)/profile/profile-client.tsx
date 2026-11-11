'use client';

import { CalendarDays, Clock3, Mail, RefreshCw, UserRound } from 'lucide-react';

import { useProfile } from '@/app/hooks/use-profile';
import { formatDate } from '@/app/utils/format-date';
import { getInitials } from '@/app/utils/get-initials';

export default function ProfileClient() {
  const { profile, error, isLoading, reloadProfile } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />

        <div className="h-52 animate-pulse rounded-2xl bg-card" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-2xl bg-card" />
          <div className="h-32 animate-pulse rounded-2xl bg-card" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <UserRound size={25} />
        </div>

        <div className="space-y-1">
          <h2 className="font-semibold text-foreground">Não foi possível carregar seu perfil</h2>

          <p className="max-w-sm text-sm text-muted-foreground">
            {error ?? 'Ocorreu um erro inesperado ao buscar seus dados.'}
          </p>
        </div>

        <button
          type="button"
          onClick={reloadProfile}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RefreshCw size={16} />
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Meu perfil</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Visualize suas informações pessoais e os dados da sua conta.
        </p>
      </div>

      {/* Perfil principal */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">
            {getInitials(profile.name)}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-semibold tracking-tight text-card-foreground">
              {profile.name}
            </h2>

            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={15} />
              <span className="truncate">{profile.email}</span>
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Conta ativa
          </div>
        </div>
      </section>

      {/* Informações pessoais */}
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Informações da conta</h3>

          <p className="mt-1 text-sm text-muted-foreground">Dados cadastrados na sua conta.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Nome completo</p>

                <p className="mt-1 text-sm font-semibold text-card-foreground">{profile.name}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">E-mail</p>

                <p className="mt-1 break-all text-sm font-semibold text-card-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Data de cadastro</p>

                <p className="mt-1 text-sm font-semibold text-card-foreground">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">Última atualização</p>

                <p className="mt-1 text-sm font-semibold text-card-foreground">
                  {formatDate(profile.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
