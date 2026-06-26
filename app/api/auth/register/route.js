import { usersCollection } from '@/lib/db';
import { hashPassword, validatePassword, publicUser } from '@/lib/auth';
import { signToken, authCookieOptions, AUTH_COOKIE } from '@/lib/jwt';
import { ok, fail } from '@/lib/api';

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Invalid request body');

  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const photoURL = (body.photoURL || '').trim();
  const password = body.password || '';

  if (!name) return fail('Name is required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail('A valid email is required');
  }
  const passwordError = validatePassword(password);
  if (passwordError) return fail(passwordError);

  const users = await usersCollection();
  const existing = await users.findOne({ email });
  if (existing) return fail('An account with this email already exists', 409);

  const now = new Date();
  const doc = {
    name,
    email,
    photoURL,
    passwordHash: await hashPassword(password),
    provider: 'credentials',
    bookmarks: [],
    createdAt: now,
    updatedAt: now,
  };
  const result = await users.insertOne(doc);
  const user = publicUser({ ...doc, _id: result.insertedId });

  const token = await signToken({ sub: user.id, email: user.email });
  const response = ok({ user }, { status: 201 });
  response.cookies.set(AUTH_COOKIE, token, authCookieOptions());
  return response;
}
