'use client';

import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

import { DeleteProductModal } from '@/app/components/delete-product-modal';
import { ProductModal } from '@/app/components/product-modal';
import { useProductsPage } from '@/app/hooks/use-products-page';
import { getProductPhotoUrl } from '@/app/utils/get-product-photo-url';

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const {
    products,
    error,
    isLoading,
    reloadProducts,

    search,
    handleSearch,

    currentPage,
    totalPages,
    firstItem,
    lastItem,
    filteredProducts,
    paginatedProducts,
    previousPage,
    nextPage,

    selectedProduct,
    productToDelete,

    isModalOpen,
    isSubmitting,
    isDeleting,
    actionError,

    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,

    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  } = useProductsPage();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Produtos</h1>

          <p className="mt-1 text-sm text-muted-foreground">Gerencie os produtos cadastrados.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          Novo produto
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-card-foreground">Todos os produtos</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {products.length} produto(s) cadastrado(s)
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={search}
                onChange={event => handleSearch(event.target.value)}
                placeholder="Buscar produtos..."
                className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={reloadProducts}
              disabled={isLoading}
              title="Atualizar listagem"
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Atualizar
            </button>
          </div>
        </div>

        {actionError && (
          <p
            role="alert"
            className="mx-5 mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {actionError}
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <Package size={30} className="text-muted-foreground" />

            <p className="text-sm text-destructive">{error}</p>

            <button
              type="button"
              onClick={reloadProducts}
              className="text-sm font-medium text-primary hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!error && isLoading && (
          <div className="space-y-4 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!error && !isLoading && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Foto
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Código
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Descrição
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {paginatedProducts.map(product => {
                    const photoUrl = getProductPhotoUrl(product.photo);

                    return (
                      <tr key={product.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-3">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={`Foto do produto ${product.code}`}
                              loading="lazy"
                              className="h-12 w-12 rounded-lg border border-border object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                              <ImageIcon size={19} />
                            </div>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-card-foreground">
                          {product.code}
                        </td>

                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {product.description}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                              product.status
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.status ? 'bg-emerald-500' : 'bg-muted-foreground'
                              }`}
                            />

                            {product.status ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              title="Editar produto"
                              aria-label={`Editar ${product.description}`}
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(product)}
                              title="Excluir produto"
                              aria-label={`Excluir ${product.description}`}
                              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-14 text-center">
                        <Package size={30} className="mx-auto mb-3 text-muted-foreground" />

                        <p className="text-sm font-medium text-card-foreground">
                          Nenhum produto encontrado
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {search
                            ? 'Tente buscar por outro código ou descrição.'
                            : 'Cadastre seu primeiro produto para começar.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredProducts.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando{' '}
                  <span className="font-medium text-card-foreground">
                    {firstItem}-{lastItem}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium text-card-foreground">
                    {filteredProducts.length}
                  </span>{' '}
                  produtos
                </p>

                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={previousPage}
                    disabled={currentPage === 1}
                    className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Anterior
                  </button>

                  <span className="px-2 text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Próxima
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <ProductModal
          key={selectedProduct?.id ?? 'new-product'}
          product={selectedProduct}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {productToDelete && (
        <DeleteProductModal
          product={productToDelete}
          isDeleting={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
