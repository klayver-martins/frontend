export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

let refreshRequest: Promise<boolean> | null = null;

function getApiUrl(path: string) {
  return `/api${path.startsWith('/') ? path : `/${path}`}`;
}

function notifySessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

async function refreshSession(): Promise<boolean> {
  if (!refreshRequest) {
    refreshRequest = fetch(getApiUrl('/auth/refresh'), {
      method: 'POST',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
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
 * Usa sempre o proxy do próprio domínio do frontend.
 * Assim, o navegador armazena os cookies HTTP-only no domínio do frontend,
 * sem depender de cookies de terceiros entre Vercel e o host da API.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const requestInit: RequestInit = {
    ...init,
    credentials: 'same-origin',
    cache: init.cache ?? 'no-store',
  };

  const response = await fetch(getApiUrl(path), requestInit);

  const isAuthEndpoint = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/logout',
  ].some(endpoint => path === endpoint);

  if (response.status !== 401 || isAuthEndpoint) {
    return response;
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    notifySessionExpired();
    return response;
  }

  const retryResponse = await fetch(getApiUrl(path), requestInit);

  if (retryResponse.status === 401) {
    notifySessionExpired();
  }

  return retryResponse;
}
