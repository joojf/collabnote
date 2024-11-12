import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('next-auth.session-token') || 
                    request.cookies.get('__Secure-next-auth.session-token');
                    
  const isAuth = !!authCookie;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublicRoute = request.nextUrl.pathname === '/';
  const isDocumentRoute = request.nextUrl.pathname.startsWith('/documents/');

  // Allow document routes if authenticated
  if (isDocumentRoute && isAuth) {
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  if (!isAuth) {
    const callbackUrl = request.nextUrl.pathname + request.nextUrl.search;
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}; 