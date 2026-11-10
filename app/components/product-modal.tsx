'use client';

import { ImagePlus, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import type { Product } from '@/app/schemas/product-schema';

interface ProductModalProps {
  product: Product | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, status?: boolean) => Promise<void>;
}

export function ProductModal({ product, isSubmitting, onClose, onSubmit }: ProductModalProps) {
  const [code, setCode] = useState(product?.code ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [status, setStatus] = useState(product?.status ?? true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!code.trim() || !description.trim()) {
      setError('Preencha o código e a descrição do produto.');
      return;
    }

    const formData = new FormData();

    formData.append('code', code.trim());
    formData.append('description', description.trim());

    if (photo) {
      formData.append('photo', photo);
    }

    const statusChanged = product !== null && status !== product.status;

    try {
      await onSubmit(formData, statusChanged ? status : undefined);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível salvar o produto.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 id="product-modal-title" className="text-lg font-semibold text-card-foreground">
              {product ? 'Editar produto' : 'Novo produto'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {product
                ? 'Atualize as informações do produto.'
                : 'Preencha os dados para cadastrar um produto.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar modal"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <label htmlFor="product-code" className="text-sm font-medium text-card-foreground">
              Código
            </label>

            <input
              id="product-code"
              value={code}
              onChange={event => setCode(event.target.value)}
              placeholder="Ex.: PROD001"
              maxLength={50}
              required
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="product-description"
              className="text-sm font-medium text-card-foreground"
            >
              Descrição
            </label>

            <textarea
              id="product-description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Descreva o produto"
              rows={3}
              maxLength={255}
              required
              disabled={isSubmitting}
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
            />
          </div>

          {product && (
            <div className="space-y-2">
              <label htmlFor="product-status" className="text-sm font-medium text-card-foreground">
                Status
              </label>

              <select
                id="product-status"
                value={String(status)}
                onChange={event => setStatus(event.target.value === 'true')}
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="product-photo" className="text-sm font-medium text-card-foreground">
              Foto do produto
            </label>

            <label
              htmlFor="product-photo"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-4 py-6 text-center transition-colors hover:border-primary hover:bg-muted/40"
            >
              <ImagePlus size={24} className="text-muted-foreground" />

              <span className="text-sm font-medium text-card-foreground">
                {photo ? photo.name : 'Selecionar uma imagem'}
              </span>

              <span className="text-xs text-muted-foreground">
                {product?.photo && !photo
                  ? 'Uma foto já está cadastrada. Selecione outra para substituí-la.'
                  : 'PNG, JPG ou JPEG'}
              </span>

              <input
                id="product-photo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="sr-only"
                disabled={isSubmitting}
                onChange={event => {
                  setPhoto(event.target.files?.[0] ?? null);
                }}
              />
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Salvando...' : product ? 'Salvar alterações' : 'Cadastrar produto'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
