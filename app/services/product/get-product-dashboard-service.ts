import { apiFetch } from '@/app/services/api-client';

export interface ProductDashboard {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

export async function getProductDashboardService(): Promise<ProductDashboard> {
  const response = await apiFetch('/products/dashboard', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Não foi possível carregar os dados do dashboard.');
  }

  return data as ProductDashboard;
}
