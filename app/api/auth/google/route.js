import { NextResponse } from 'next/server';

// Starts the Google OAuth 2.0 authorization-code flow by redirecting the user
// to Google's consent screen. A random `state` is stored in a short-lived
// cookie and verified in the callback to prevent CSRF.
export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

  if (!clientId) {
    const loginUrl = new URL('/login', base);
    loginUrl.searchParams.set('error', 'Google login is not configured');
    return NextResponse.redirect(loginUrl);
  }

  const redirectAfter = new URL(request.url).searchParams.get('redirect') || '/';
  const nonce = crypto.randomUUID();
  const state = Buffer.from(JSON.stringify({ nonce, redirect: redirectAfter })).toString('base64url');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', `${base}/api/auth/google/callback`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('prompt', 'select_account');

  const response = NextResponse.redirect(authUrl);
  response.cookies.set('oauth_state', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return response;
}
