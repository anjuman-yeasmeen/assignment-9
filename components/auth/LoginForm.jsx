'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import GoogleButton from './GoogleButton';
import Spinner from '@/components/ui/Spinner';

export default function LoginForm({ redirect = '/', initialError = '' }) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Surface OAuth errors passed back via the query string.
  useEffect(() => {
    if (initialError) toast.error(initialError);
  }, [initialError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-500">Log in to continue to IdeaVault.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} required
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Password</label>
              <button
                type="button"
                onClick={() => toast('Password reset is not available in this demo.', { icon: 'ℹ️' })}
                className="mb-1.5 text-xs font-medium text-brand-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input className="input pr-10" type={show ? 'text' : 'password'} value={password}
                required onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
              <button type="button" onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />} Log In
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" /> OR
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <GoogleButton redirect={redirect} label="Log in with Google" />

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don’t have an account?{' '}
          <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
