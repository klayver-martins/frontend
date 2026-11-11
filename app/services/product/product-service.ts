import { productSchema, type Product } from '@/app/schemas/product-schema';
import { apiFetch } from '@/app/services/api-client';
import z from 'zod';

async function getErrorMessage(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);

  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
  ) {
    return data.message;
  }

  return 'Não foi possível realizar a operação.';
}

export async function getProductsService(): Promise<Product[]> {
  const response = await apiFetch('/products', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));

  const data: unknown = await response.json();
  const result = z.array(productSchema).safeParse(data);

  if (!result.success) throw new Error('A API retornou uma lista de produtos inválida.');

  return result.data;
}

export async function createProductService(formData: FormData): Promise<void> {
  const response = await apiFetch('/products', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));
}

export async function updateProductService(id: number, formData: FormData): Promise<void> {
  const response = await apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));
}

export async function deleteProductService(id: number): Promise<void> {
  const response = await apiFetch(`/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) throw new Error(await getErrorMessage(response));
}
