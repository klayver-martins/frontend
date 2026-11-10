export interface ProductDashboard {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductDashboardService(): Promise<ProductDashboard> {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/products/dashboard`, {
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
