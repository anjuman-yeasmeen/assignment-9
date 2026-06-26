import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { usersCollection } from './db';
import { AUTH_COOKIE, verifyToken } from './jwt';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

// Assignment rule: min 6 chars, must include an uppercase and a lowercase letter.
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must include an uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must include a lowercase letter';
  }
  return null;
}

// Shape returned to the client — never includes the password hash.
export function publicUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    photoURL: user.photoURL || '',
    provider: user.provider || 'credentials',
  };
}

// Reads the auth cookie, verifies the JWT, and loads the user from the DB.
// Returns null when unauthenticated. Use in route handlers and server components.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;

  let userId;
  try {
    userId = new ObjectId(payload.sub);
  } catch {
    return null;
  }

  const users = await usersCollection();
  const user = await users.findOne({ _id: userId });
  return publicUser(user);
}
