import { getCurrentUser } from '@/lib/auth';
import { ok } from '@/lib/api';

// Returns the currently authenticated user (or null). The auth cookie is
// httpOnly, so the client relies on this endpoint to know who is logged in.
export async function GET() {
  const user = await getCurrentUser();
  return ok({ user });
}
