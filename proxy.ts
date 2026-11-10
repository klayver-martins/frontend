import { NextRequest, NextResponse } from 'next/server';

// Rotas que podem ser acessadas por usuários não autenticados.
const publicRoutes = ['/login', '/register'];

// Rotas que exigem autenticação.
const privateRoutes = ['/produtos', '/home'];

export function proxy(request: NextRequest) {
  // Recupera o token armazenado no cookie da requisição.
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  const isAuthenticated = !!token;

  // Verifica se a rota atual está na lista de rotas públicas.
  const isPublicRoute = publicRoutes.includes(pathname);

  // Verifica se a rota atual é privada ou uma subrota de uma rota privada.
  const isPrivateRoute = privateRoutes.some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Se estiver autenticado, impede o acesso às páginas de login e cadastro.
  // Redireciona o usuário para a página inicial.
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Se não estiver autenticado, impede o acesso às páginas privadas.
  // Redireciona o usuário para a página de login.
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se nenhuma regra de redirecionamento for atendida, permite a navegação.
  return NextResponse.next();
}

// Define quais rotas devem passar pela verificação do proxy.
export const config = {
  matcher: ['/login', '/register', '/product/:path*', '/home/:path*', '/dashboard/:path*'],
};
