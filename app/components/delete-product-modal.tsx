'use client';

import { AlertTriangle, LoaderCircle, Trash2, X } from 'lucide-react';

import type { Product } from '@/app/schemas/product-schema';

interface DeleteProductModalProps {
  product: Product;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteProductModal({
  product,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteProductModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        aria-describedby="delete-product-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Fechar modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-2 px-6 pb-6">
          <h2 id="delete-product-title" className="text-lg font-semibold text-card-foreground">
            Excluir produto?
          </h2>

          <p
            id="delete-product-description"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            Você está prestes a excluir este produto. Essa ação não poderá ser desfeita.
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground">
              <Trash2 size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-card-foreground">
                {product.description}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">Código: {product.code}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Excluir produto
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
