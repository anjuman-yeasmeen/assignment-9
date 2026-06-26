import { SignJWT, jwtVerify } from 'jose';

// Kept dependency-free (only `jose`) so it can be imported by both route
// handlers and proxy.js without pulling in the MongoDB driver or bcrypt.

export const AUTH_COOKIE = 'token';
const TOKEN_TTL = '7d';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing JWT_SECRET environment variable');
  return new TextEncoder().encode(secret);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

// Returns the decoded payload, or null if the token is missing/invalid/expired.
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

// Cookie options shared by login/register/logout responses.
export function authCookieOptions(maxAge = MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}
