
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For now, let's disable middleware protection and rely on client-side protection
  // This is more reliable with Supabase authentication
  
  // Only handle auth routes redirects (if already logged in, don't show login/signup)
  // We'll check this with a more basic approach
  const authToken = request.cookies.get('sb-access-token') || 
                   request.cookies.get('supabase.auth.token') ||
                   request.cookies.get('sb-fxeogbzwstepyyjgvkrq-auth-token');

  if (AUTH_ROUTES.includes(pathname) && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Remove protected route redirects for now - let client-side handle it
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     * - manifest.json (PWA manifest)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};
