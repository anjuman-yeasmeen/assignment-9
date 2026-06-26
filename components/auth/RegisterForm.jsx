'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '@/components/providers/AuthProvider';
import GoogleButton from './GoogleButton';
import Spinner from '@/components/ui/Spinner';

const rules = [
  { label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
];

export default function RegisterForm({ redirect = '/' }) {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const failed = rules.find((r) => !r.test(form.password));
    if (failed) return toast.error(`Password requirement: ${failed.label.toLowerCase()}`);

    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to IdeaVault.');
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
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-neutral-500">Join IdeaVault and start sharing ideas.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={set('name')} required placeholder="Jane Founder" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Photo URL <span className="text-neutral-400">(optional)</span></label>
            <input className="input" type="url" value={form.photoURL} onChange={set('photoURL')} placeholder="https://…" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input className="input pr-10" type={show ? 'text' : 'password'} value={form.password}
                onChange={set('password')} required placeholder="Create a password" />
              <button type="button" onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {rules.map((r) => {
                const passed = r.test(form.password);
                return (
                  <li key={r.label} className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-600' : 'text-neutral-400'}`}>
                    {passed ? <FiCheck className="h-3.5 w-3.5" /> : <FiX className="h-3.5 w-3.5" />}
                    {r.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading && <Spinner className="h-4 w-4" />} Create Account
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-neutral-400">
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" /> OR
          <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <GoogleButton redirect={redirect} label="Sign up with Google" />

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
