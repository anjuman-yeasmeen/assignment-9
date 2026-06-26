'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/client';
import { useAuth } from '@/components/providers/AuthProvider';
import Spinner, { PageSpinner } from '@/components/ui/Spinner';
import usePageTitle from '@/components/ui/usePageTitle';

export default function ProfilePage() {
  usePageTitle('Profile');
  const { user, loading, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', photoURL: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', photoURL: user.photoURL || '' });
  }, [user]);

  if (loading || !user) return <PageSpinner label="Loading profile…" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await apiFetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-neutral-500">Manage your account details.</p>
      </header>

      <div className="card p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          {form.photoURL ? (
            <Image src={form.photoURL} alt={form.name} width={80} height={80}
              className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-2xl font-semibold text-white">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
            <span className="chip mt-1 capitalize">{user.provider} account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} required
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input cursor-not-allowed opacity-60" value={user.email} disabled />
            <p className="mt-1 text-xs text-neutral-400">Email cannot be changed.</p>
          </div>
          <div>
            <label className="label">Photo URL</label>
            <input className="input" type="url" value={form.photoURL}
              onChange={(e) => setForm((f) => ({ ...f, photoURL: e.target.value }))}
              placeholder="https://…" />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />} Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
