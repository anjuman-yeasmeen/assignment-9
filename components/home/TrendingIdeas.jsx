'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { apiFetch } from '@/lib/client';
import IdeaCard from '@/components/ideas/IdeaCard';
import Spinner from '@/components/ui/Spinner';

export default function TrendingIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/ideas?sort=trending&limit=6')
      .then((data) => setIdeas(data.ideas))
      .catch(() => setIdeas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Trending Ideas</h2>
          <p className="mt-2 text-neutral-500">The concepts the community is buzzing about right now.</p>
        </div>
        <Link
          href="/ideas"
          className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all sm:inline-flex dark:text-brand-400"
        >
          View all <FiArrowRight />
        </Link>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : ideas.length === 0 ? (
        <p className="py-12 text-center text-neutral-500">
          No ideas yet — be the first to{' '}
          <Link href="/add-idea" className="font-semibold text-brand-600">share one</Link>.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} />
          ))}
        </div>
      )}
    </section>
  );
}
