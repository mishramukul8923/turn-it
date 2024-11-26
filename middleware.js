// /middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware triggered for:', request.nextUrl.pathname);

  const isAuthenticated = Boolean(request.cookies.get('token'));
  // const isAuthenticated = true;
  console.log("auth status", isAuthenticated)
  console.log("middleware is working")

  if (!isAuthenticated) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to certain paths
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
