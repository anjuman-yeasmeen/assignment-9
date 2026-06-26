'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/client';
import IdeaForm from '@/components/ideas/IdeaForm';
import usePageTitle from '@/components/ui/usePageTitle';

export default function AddIdeaPage() {
  usePageTitle('Add Idea');
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      const data = await apiFetch('/api/ideas', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      toast.success('Idea shared successfully!');
      router.push(`/ideas/${data.idea._id}`);
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Share a Startup Idea</h1>
        <p className="mt-2 text-neutral-500">
          Describe your concept clearly so the community can give you the best feedback.
        </p>
      </header>
      <div className="card p-6 sm:p-8">
        <IdeaForm onSubmit={handleSubmit} submitLabel="Submit Idea" submitting={submitting} />
      </div>
    </div>
  );
}
