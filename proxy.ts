import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/cadastro';

  const isPrivatePage = pathname.startsWith('/produtos');

  // Usuário autenticado não acessa login ou cadastro
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/produtos', request.url));
  }

  // Usuário não autenticado não acessa áreas privadas
  if (!token && isPrivatePage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/cadastro', '/produtos/:path*'],
};
