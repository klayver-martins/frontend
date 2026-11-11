import { NextRequest, NextResponse } from 'next/server';

/**
 * Os cookies de autenticação são definidos pelo servidor da API.
 * Quando o frontend e a API utilizam domínios diferentes,
 * o Next.js pode não ter acesso a esses cookies.
 *
 * A validação da sessão é realizada pelo AuthGuard,
 * através da rota /users/me.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/home/:path*', '/products/:path*', '/profile/:path*'],
};
