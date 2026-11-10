'use client';

import { useCallback, useEffect, useState } from 'react';

import type { Product } from '@/app/schemas/product-schema';
import {
  createProductService,
  deleteProductService,
  getProductsService,
  updateProductService,
} from '@/app/services/product/product-service';

const API_URL = process.env.API_URL;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const reloadProducts = useCallback(() => {
    setReloadKey(previous => previous + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);

      try {
        const data = await getProductsService();

        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : 'Não foi possível carregar os produtos.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const createProduct = useCallback(
    async (formData: FormData) => {
      await createProductService(formData);
      reloadProducts();
    },
    [reloadProducts],
  );

  const updateProduct = useCallback(
    async (id: number, formData: FormData, status?: boolean) => {
      await updateProductService(id, formData);

      if (status !== undefined) {
        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id,
            status,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || 'Não foi possível atualizar o status do produto.');
        }
      }

      reloadProducts();
    },
    [reloadProducts],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      await deleteProductService(id);
      reloadProducts();
    },
    [reloadProducts],
  );

  return {
    products,
    error,
    isLoading,
    reloadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
