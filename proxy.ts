import { NextRequest, NextResponse } from 'next/server';

// Rotas que exigem autenticação.
const protectedRoutes = ['/home', '/products', '/profile'];

// Rotas exclusivas para usuários não autenticados.
const authRoutes = ['/login', '/register'];

// Verifica se o usuário possui token.
function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('token')?.value;

  return !!token;
}

// Verifica se o caminho corresponde a alguma rota.
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  // Usuário não autenticado tentando acessar rota protegida.
  if (!authenticated && matchesRoute(pathname, protectedRoutes)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Usuário autenticado tentando acessar login ou register.
  if (authenticated && matchesRoute(pathname, authRoutes)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login/:path*',
    '/register/:path*',
    '/home/:path*',
    '/products/:path*',
    '/profile/:path*',
  ],
};
