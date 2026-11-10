'use client';

import { Activity, AlertCircle, Package, RefreshCw, TrendingUp } from 'lucide-react';

import { useProductDashboard } from '@/app/hooks/use-product-dashboard';

export default function HomePage() {
  const page = useProductDashboard();

  const activePercentage =
    page.dashboard && page.dashboard.totalProducts > 0
      ? Math.round((page.dashboard.activeProducts / page.dashboard.totalProducts) * 100)
      : 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Acompanhe os indicadores dos seus produtos.
          </p>
        </div>

        <button
          type="button"
          onClick={page.reloadDashboard}
          disabled={page.isLoading}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={page.isLoading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {page.error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-destructive" />

            <p className="text-sm text-destructive">{page.error}</p>
          </div>

          <button
            type="button"
            onClick={page.reloadDashboard}
            className="shrink-0 text-sm font-medium text-destructive hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {page.isLoading && !page.dashboard ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
      ) : page.dashboard ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package size={22} />
                </div>

                <span className="text-xs font-medium text-muted-foreground">Geral</span>
              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">Total de produtos</p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-card-foreground">
                  {page.dashboard.totalProducts}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Activity size={22} />
                </div>

                <span className="text-xs font-medium text-emerald-500">Ativos</span>
              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">Produtos ativos</p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-card-foreground">
                  {page.dashboard.activeProducts}
                </h2>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <TrendingUp size={22} />
                </div>

                <span className="text-xs font-medium text-amber-500">Inativos</span>
              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">Produtos inativos</p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-card-foreground">
                  {page.dashboard.inactiveProducts}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-card-foreground">Situação dos produtos</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Distribuição dos produtos cadastrados por status.
                </p>
              </div>

              <span className="text-sm font-semibold text-emerald-500">
                {activePercentage}% ativos
              </span>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Ativos</span>

                <span>
                  {page.dashboard.activeProducts} de {page.dashboard.totalProducts}
                </span>
              </div>

              <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${activePercentage}%` }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm text-muted-foreground">
                    Ativos: {page.dashboard.activeProducts}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />

                  <span className="text-sm text-muted-foreground">
                    Inativos: {page.dashboard.inactiveProducts}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
