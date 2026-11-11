const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

let refreshRequest: Promise<boolean> | null = null;

function getApiUrl(path: string) {
  if (!apiBaseUrl) {
    throw new Error('URL da API não configurada.');
  }

  const normalizedBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  return `${normalizedBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

async function refreshSession(): Promise<boolean> {
  if (!refreshRequest) {
    refreshRequest = fetch(getApiUrl('/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
      .then(response => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

/**
 * Faz chamadas autenticadas usando cookies HTTP-only.
 * Em caso de access token expirado, renova a sessão uma única vez
 * e repete a requisição original.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const requestInit: RequestInit = {
    ...init,
    credentials: 'include',
    cache: init.cache ?? 'no-store',
  };

  const response = await fetch(getApiUrl(path), requestInit);

  const isAuthEndpoint = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some(
    endpoint => path === endpoint,
  );

  if (response.status !== 401 || isAuthEndpoint) {
    return response;
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.replace('/login');
    }

    return response;
  }

  return fetch(getApiUrl(path), requestInit);
}
