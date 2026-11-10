export interface ProductDashboard {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

const API_URL_BACKEND = process.env.API_URL_BACKEND;

export async function getProductDashboardService(): Promise<ProductDashboard> {
  const response = await fetch(`${API_URL_BACKEND}/products/dashboard`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível carregar os dados do dashboard.');
  }

  return data as ProductDashboard;
}
