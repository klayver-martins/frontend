import { api } from '@/app/services/api';

export interface ProductDashboard {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

export async function getProductDashboardService(): Promise<ProductDashboard> {
  const response = await api.get('/products/dashboard');
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Não foi possível carregar os dados do dashboard.');
  }

  return data as ProductDashboard;
}
