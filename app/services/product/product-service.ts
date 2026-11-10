import { productSchema, type Product } from '@/app/schemas/product-schema';
import z from 'zod';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  if (!NEXT_PUBLIC_API_URL) {
    throw new Error('URL da API não configurada.');
  }

  return NEXT_PUBLIC_API_URL;
}

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
  const response = await fetch(`${getApiUrl()}/products`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const data: unknown = await response.json();
  const result = z.array(productSchema).safeParse(data);

  if (!result.success) {
    throw new Error('A API retornou uma lista de produtos inválida.');
  }

  return result.data;
}

export async function createProductService(formData: FormData): Promise<void> {
  const response = await fetch(`${getApiUrl()}/products`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function updateProductService(id: number, formData: FormData): Promise<void> {
  const response = await fetch(`${getApiUrl()}/products/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function deleteProductService(id: number): Promise<void> {
  const response = await fetch(`${getApiUrl()}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}
