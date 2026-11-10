import { NextRequest, NextResponse } from 'next/server';

// Rotas acessíveis sem autenticação.
const publicRoutes = ['/login', '/register'];

// Rotas que exigem autenticação.
const privateRoutes = ['/home', '/products', '/profile'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = Boolean(token);

  const isPublicRoute = publicRoutes.includes(pathname);

  const isPrivateRoute = privateRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Usuário autenticado não deve acessar login ou cadastro.
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Usuário não autenticado não pode acessar rotas privadas.
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/home/:path*', '/products/:path*', '/profile/:path*'],
};
