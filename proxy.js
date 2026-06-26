import { NextResponse } from 'next/server';
import { AUTH_COOKIE, verifyToken } from '@/lib/jwt';

// Next.js 16: middleware was renamed to `proxy` (runs on the Node.js runtime).
// This guards private routes server-side so a logged-in user is never bounced
// to /login when reloading a private page, while logged-out users are
// redirected with a `redirect` query param to return after authenticating.
export async function proxy(request) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const payload = await verifyToken(token);

  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matches the private routes. Note `/ideas/:path+` covers the idea details
  // page (/ideas/<id>) but intentionally NOT the public listing at /ideas.
  matcher: [
    '/add-idea',
    '/my-ideas',
    '/my-interactions',
    '/profile',
    '/ideas/:path+',
  ],
};
