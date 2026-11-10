'use client';

import { useMemo, useState } from 'react';

import { useProducts } from '@/app/hooks/use-products';
import type { Product } from '@/app/schemas/product-schema';

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

      const remainingItems = filteredProducts.length - 1;
      const lastPage = Math.max(1, Math.ceil(remainingItems / ITEMS_PER_PAGE));

      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Não foi possível excluir o produto.',
      );
    } finally {
      setIsDeleting(false);
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
  };
}
