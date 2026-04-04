import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export { authOptions } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/reviews', '/destinations'];
  const isPublicPath = publicPaths.some(path => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });

  // Allow API routes (except protected ones)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow static files and images
  if (pathname.startsWith('/_next') || pathname.startsWith('/logo') || pathname.startsWith('/images')) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('next-auth.session-token')?.value ||
                         request.cookies.get('__Secure-next-auth.session-token')?.value;

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};
