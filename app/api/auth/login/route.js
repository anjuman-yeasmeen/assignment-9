import { usersCollection } from '@/lib/db';
import { verifyPassword, publicUser } from '@/lib/auth';
import { signToken, authCookieOptions, AUTH_COOKIE } from '@/lib/jwt';
import { ok, fail } from '@/lib/api';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Invalid request body');

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  if (!email || !password) return fail('Email and password are required');

  const users = await usersCollection();
  const user = await users.findOne({ email });
  // Same message for unknown email and wrong password to avoid user enumeration.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return fail('Invalid email or password', 401);
  }

  const token = await signToken({ sub: user._id.toString(), email: user.email });
  const response = ok({ user: publicUser(user) });
  response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  return response;
}
