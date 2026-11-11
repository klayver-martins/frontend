'use client';

import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useProducts } from '@/app/hooks/use-products';
import type { Product } from '@/app/schemas/product-schema';
import { deleteProductService } from '@/app/services/product/product-service';

const ITEMS_PER_PAGE = 10;

export function useProductsPage() {
  const {
    products,
    error,
    isLoading,
    reloadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [bulkDeleteError, setBulkDeleteError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      return products;
    }

    return products.filter(
      product =>
        product.code.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm),
    );
  }, [products, search]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const firstItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const lastItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);
  const isAllFilteredProductsSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every(product => selectedProductIds.includes(product.id));

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function previousPage() {
    setCurrentPage(previous => Math.max(1, previous - 1));
  }

  function nextPage() {
    setCurrentPage(previous => Math.min(totalPages, previous + 1));
  }

  function openCreateModal() {
    setSelectedProduct(null);
    setActionError(null);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setSelectedProduct(product);
    setActionError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  async function handleSubmit(formData: FormData, status?: boolean) {
    setIsSubmitting(true);
    setActionError(null);

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData, status);
      } else {
        await createProduct(formData);
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível salvar o produto.');

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  function openDeleteModal(product: Product) {
    setProductToDelete(product);
    setActionError(null);
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setProductToDelete(null);
  }

  async function handleDelete() {
    if (!productToDelete) {
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await deleteProduct(productToDelete.id);

      setProductToDelete(null);
      setSelectedProductIds(previous => previous.filter(id => id !== productToDelete.id));
      toast.success('Produto excluído com sucesso.');

      const remainingItems = filteredProducts.length - 1;
      const lastPage = Math.max(1, Math.ceil(remainingItems / ITEMS_PER_PAGE));

      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível excluir o produto.';

      setActionError(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleProductSelection(productId: number) {
    setSelectedProductIds(previous =>
      previous.includes(productId)
        ? previous.filter(id => id !== productId)
        : [...previous, productId],
    );
  }

  function toggleAllFilteredProducts() {
    const filteredIds = filteredProducts.map(product => product.id);

    setSelectedProductIds(previous =>
      isAllFilteredProductsSelected
        ? previous.filter(id => !filteredIds.includes(id))
        : [...new Set([...previous, ...filteredIds])],
    );
  }

  function openBulkDeleteModal() {
    if (selectedProductIds.length === 0) {
      return;
    }

    setBulkDeleteError(null);
    setDeleteProgress(null);
    setIsBulkDeleteModalOpen(true);
  }

  function closeBulkDeleteModal() {
    if (isDeleting) {
      return;
    }

    setIsBulkDeleteModalOpen(false);
    setBulkDeleteError(null);
    setDeleteProgress(null);
  }

  async function handleBulkDelete() {
    const idsToDelete = [...selectedProductIds];

    if (idsToDelete.length === 0) {
      return;
    }

    setIsDeleting(true);
    setBulkDeleteError(null);
    setDeleteProgress({ completed: 0, total: idsToDelete.length });

    const deletedIds: number[] = [];
    const errors: string[] = [];

    try {
      for (const [index, id] of idsToDelete.entries()) {
        try {
          await deleteProductService(id);
          deletedIds.push(id);
        } catch (error) {
          const product = products.find(item => item.id === id);
          const productName = product ? `${product.description} (${product.code})` : `ID ${id}`;
          const message =
            error instanceof Error ? error.message : 'Não foi possível excluir o produto.';

          errors.push(`${productName}: ${message}`);
        } finally {
          setDeleteProgress({ completed: index + 1, total: idsToDelete.length });
        }
      }

      if (deletedIds.length > 0) {
        reloadProducts();
        setSelectedProductIds(idsToDelete.filter(id => !deletedIds.includes(id)));

        const deletedFilteredCount = deletedIds.filter(id =>
          filteredProducts.some(product => product.id === id),
        ).length;
        const remainingItems = Math.max(0, filteredProducts.length - deletedFilteredCount);
        const lastPage = Math.max(1, Math.ceil(remainingItems / ITEMS_PER_PAGE));

        setCurrentPage(previous => Math.min(previous, lastPage));
      }

      if (errors.length > 0) {
        const failedProductsLabel = errors.length === 1 ? 'produto' : 'produtos';

        setBulkDeleteError(
          `Não foi possível excluir ${errors.length} ${failedProductsLabel}: ${errors.join('; ')}`,
        );

        if (deletedIds.length > 0) {
          toast.success(
            deletedIds.length === 1
              ? '1 produto excluído com sucesso.'
              : `${deletedIds.length} produtos excluídos com sucesso.`,
          );
        }

        toast.error(
          `Não foi possível excluir ${errors.length} ${failedProductsLabel}. Confira os detalhes.`,
        );
      } else {
        setIsBulkDeleteModalOpen(false);
        toast.success(
          deletedIds.length === 1
            ? '1 produto excluído com sucesso.'
            : `${deletedIds.length} produtos excluídos com sucesso.`,
        );
      }
    } finally {
      setIsDeleting(false);
      setDeleteProgress(null);
    }
  }

  return {
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
    selectedProductsCount: selectedProductIds.length,
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
  };
}
