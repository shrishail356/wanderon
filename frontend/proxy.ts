import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log for debugging
  console.log('[Proxy] Processing request:', pathname);

  // Check if user is trying to access protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Get auth token from cookies
  const token = request.cookies.get('token');

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    console.log('[Proxy] No token, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes with token
  if (isAuthRoute && token) {
    console.log('[Proxy] Token exists, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('[Proxy] Allowing request through');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

