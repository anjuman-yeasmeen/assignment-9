import { NextResponse } from 'next/server';
import { usersCollection } from '@/lib/db';
import { signToken, authCookieOptions, AUTH_COOKIE } from '@/lib/jwt';

function loginError(base, message) {
  const url = new URL('/login', base);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url);
}

// Handles the redirect back from Google: validates state, exchanges the code
// for tokens, fetches the profile, upserts the user, and issues our JWT cookie.
export async function GET(request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');
  const storedNonce = request.cookies.get('oauth_state')?.value;

  if (!code || !stateParam) return loginError(base, 'Google login failed');

  let state;
  try {
    state = JSON.parse(Buffer.from(stateParam, 'base64url').toString());
  } catch {
    return loginError(base, 'Invalid login state');
  }
  if (!storedNonce || storedNonce !== state.nonce) {
    return loginError(base, 'Login state mismatch, please try again');
  }

  // Exchange the authorization code for tokens.
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: `${base}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) return loginError(base, 'Could not verify Google account');
  const tokens = await tokenRes.json();

  // Fetch the user's profile.
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) return loginError(base, 'Could not load Google profile');
  const profile = await profileRes.json();

  const email = (profile.email || '').toLowerCase();
  if (!email) return loginError(base, 'Google account has no email');

  const users = await usersCollection();
  const now = new Date();
  await users.updateOne(
    { email },
    {
      $set: {
        name: profile.name || email.split('@')[0],
        photoURL: profile.picture || '',
        provider: 'google',
        updatedAt: now,
      },
      $setOnInsert: { email, bookmarks: [], createdAt: now },
    },
    { upsert: true }
  );
  const user = await users.findOne({ email });

  const token = await signToken({ sub: user._id.toString(), email });
  const redirectTo = new URL(state.redirect || '/', base);
  const response = NextResponse.redirect(redirectTo);
  response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  response.cookies.set('oauth_state', '', { path: '/', maxAge: 0 });
  return response;
}
