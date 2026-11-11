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

function ProductPhoto({
  photo,
  code,
  className,
  iconSize,
}: {
  photo?: string | null;
  code: string;
  className: string;
  iconSize: number;
}) {
  const photoUrl = getProductPhotoUrl(photo);

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`Foto do produto ${code}`}
        loading="lazy"
        className={className}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center border border-border bg-muted text-muted-foreground`}
    >
      <ImageIcon size={iconSize} />
    </div>
  );
}

export default function ProductsClient() {
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
    selectedProductIds,
    selectedProductsCount,
    isAllFilteredProductsSelected,
    isBulkDeleteModalOpen,
    deleteProgress,
    bulkDeleteError,

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
    toggleProductSelection,
    toggleAllFilteredProducts,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
  } = useProductsPage();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Produtos</h1>

          <p className="mt-1 text-sm text-muted-foreground">Gerencie os produtos cadastrados.</p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
        >
          <Plus size={18} />
          Novo produto
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card sm:rounded-2xl">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-card-foreground">Todos os produtos</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {products.length} produto(s) cadastrado(s)
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] lg:flex lg:flex-wrap lg:items-center lg:justify-end">
            {filteredProducts.length > 0 && (
              <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground sm:col-span-2 lg:col-span-1">
                <input
                  type="checkbox"
                  checked={isAllFilteredProductsSelected}
                  onChange={toggleAllFilteredProducts}
                  disabled={isDeleting}
                  aria-label="Selecionar todos os produtos filtrados"
                  className="h-4 w-4 cursor-pointer accent-primary disabled:cursor-not-allowed"
                />
                <span>Selecionar todos</span>
              </label>
            )}

            <div className="relative min-w-0 sm:col-span-2 lg:w-64 lg:flex-none">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                value={search}
                onChange={event => handleSearch(event.target.value)}
                placeholder="Buscar produtos..."
                className="h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={reloadProducts}
              disabled={isLoading}
              title="Atualizar listagem"
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Atualizar
            </button>

            {selectedProductsCount > 0 && (
              <button
                type="button"
                onClick={openBulkDeleteModal}
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-destructive px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:col-span-2 lg:col-span-1"
              >
                <Trash2 size={16} />
                Excluir selecionados ({selectedProductsCount})
              </button>
            )}
          </div>
        </div>

        {actionError && (
          <p
            role="alert"
            className="mx-4 mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive sm:mx-5"
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
          <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        )}

        {!error && !isLoading && (
          <>
            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center sm:py-14">
                <Package size={30} className="mb-3 text-muted-foreground" />

                <p className="text-sm font-medium text-card-foreground">Nenhum produto encontrado</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {search
                    ? 'Tente buscar por outro código ou descrição.'
                    : 'Cadastre seu primeiro produto para começar.'}
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border xl:hidden">
                  {paginatedProducts.map(product => {
                    return (
                      <article key={product.id} className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            disabled={isDeleting}
                            aria-label={`Selecionar ${product.description}`}
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed"
                          />

                          <ProductPhoto
                            photo={product.photo}
                            code={product.code}
                            className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
                            iconSize={20}
                          />

                          <div className="min-w-0 flex-1">
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

                            <p className="mt-2 break-words text-sm font-semibold text-card-foreground">
                              {product.description}
                            </p>

                            <p className="mt-1 break-all text-xs text-muted-foreground">
                              Código: {product.code}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2 border-t border-border pt-3">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            disabled={isDeleting}
                            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(product)}
                            disabled={isDeleting}
                            className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[780px] text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="w-12 px-4 py-4">
                          <span className="sr-only">Selecionar</span>
                        </th>

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
                        return (
                          <tr key={product.id} className="transition-colors hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedProductIds.includes(product.id)}
                                onChange={() => toggleProductSelection(product.id)}
                                disabled={isDeleting}
                                aria-label={`Selecionar ${product.description}`}
                                className="h-4 w-4 cursor-pointer accent-primary disabled:cursor-not-allowed"
                              />
                            </td>

                            <td className="px-5 py-3">
                              <ProductPhoto
                                photo={product.photo}
                                code={product.code}
                                className="h-12 w-12 rounded-lg border border-border object-cover"
                                iconSize={19}
                              />
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
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {filteredProducts.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
                    className="flex h-10 items-center gap-1 rounded-lg border border-border px-2 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
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
                    className="flex h-10 items-center gap-1 rounded-lg border border-border px-2 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
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

      {isBulkDeleteModalOpen && (
        <DeleteProductModal
          product={null}
          count={selectedProductsCount}
          isDeleting={isDeleting}
          progress={deleteProgress}
          error={bulkDeleteError}
          onClose={closeBulkDeleteModal}
          onConfirm={handleBulkDelete}
        />
      )}
    </div>
  );
}
