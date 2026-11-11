const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

if (!API_URL) {
  throw new Error('Configure NEXT_PUBLIC_API_URL com a URL pública do backend.');
}

type RequestData = BodyInit | Record<string, unknown> | null | undefined;

type RequestOptions = Omit<RequestInit, 'body'>;

let refreshRequest: Promise<boolean> | null = null;

function buildBody(data: RequestData, headers: Headers): BodyInit | undefined {
  if (data === undefined || data === null) return undefined;

  if (
    typeof data === 'string' ||
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    data instanceof Blob ||
    data instanceof ArrayBuffer
  ) {
    return data;
  }

  headers.set('Content-Type', 'application/json');
  return JSON.stringify(data);
}

function endpoint(path: string): string {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function refreshSession(): Promise<boolean> {
  if (!refreshRequest) {
    refreshRequest = fetch(endpoint('/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
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

function isAuthEndpoint(path: string): boolean {
  return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some(
    route => path === route,
  );
}

async function request(
  method: string,
  path: string,
  data?: RequestData,
  options: RequestOptions = {},
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('Accept', headers.get('Accept') ?? 'application/json');

  const init: RequestInit = {
    ...options,
    method,
    headers,
    body: buildBody(data, headers),
    credentials: 'include',
    cache: options.cache ?? 'no-store',
  };

  const response = await fetch(endpoint(path), init);

  if (response.status !== 401 || isAuthEndpoint(path)) {
    return response;
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return response;
  }

  return fetch(endpoint(path), init);
}

export const api = {
  get: (url: string, options?: RequestOptions) => request('GET', url, undefined, options),
  post: (url: string, data?: RequestData, options?: RequestOptions) =>
    request('POST', url, data, options),
  put: (url: string, data?: RequestData, options?: RequestOptions) =>
    request('PUT', url, data, options),
  patch: (url: string, data?: RequestData, options?: RequestOptions) =>
    request('PATCH', url, data, options),
  delete: (url: string, options?: RequestOptions) => request('DELETE', url, undefined, options),
};
