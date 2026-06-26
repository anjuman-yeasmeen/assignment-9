import { authCookieOptions, AUTH_COOKIE } from '@/lib/jwt';
import { ok } from '@/lib/api';

export async function POST() {
  const response = ok({ success: true });
  // Expire the cookie immediately.
  response.cookies.set(AUTH_COOKIE, '', authCookieOptions(0));
  return response;
}
