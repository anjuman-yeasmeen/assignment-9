import { NextResponse } from 'next/server';
import { getCurrentUser } from './auth';

export function ok(data, init) {
  return NextResponse.json(data, init);
}

export function fail(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Loads the authenticated user for an API route, or returns a 401 response.
// Usage: const { user, response } = await requireAuth(); if (response) return response;
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, response: fail('Unauthorized', 401) };
  }
  return { user, response: null };
}
