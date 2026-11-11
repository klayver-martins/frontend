import { NextRequest, NextResponse } from 'next/server';

/**
 * Authentication cookies are issued by the API host. When frontend and API
 * use different hosts, they are not visible to this Next.js proxy.
 * The dashboard validates the session against /users/me through AuthGuard.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/home/:path*', '/products/:path*', '/profile/:path*'],
};
