import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// Disable Edge Runtime to avoid bcryptjs/Prisma compatibility issues
export const runtime = 'nodejs';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;

  // Public routes
  const isPublicRoute =
    pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup');

  // API routes
  const isApiRoute = pathname.startsWith('/api');

  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuth && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect unauthenticated users to login
  if (!isAuth && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
