'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getProductDashboardService,
  type ProductDashboard,
} from '@/app/services/product/get-product-dashboard-service';

export function useProductDashboard() {
  const [dashboard, setDashboard] = useState<ProductDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const reloadDashboard = useCallback(() => {
    setReloadKey(previous => previous + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProductDashboardService();

        if (isMounted) {
          setDashboard(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error ? error.message : 'Não foi possível carregar o dashboard.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  return {
    dashboard,
    error,
    isLoading,
    reloadDashboard,
  };
}
