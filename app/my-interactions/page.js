'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { apiFetch } from '@/lib/client';
import { timeAgo } from '@/lib/format';
import { PageSpinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import usePageTitle from '@/components/ui/usePageTitle';

export default function MyInteractionsPage() {
  usePageTitle('My Interactions');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/my-interactions')
      .then((data) => setItems(data.interactions))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner label="Loading your activity…" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Interactions</h1>
        <p className="mt-2 text-neutral-500">Ideas you’ve engaged with through comments.</p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No interactions yet"
          message="When you comment on ideas, they’ll show up here for quick access."
          actionHref="/ideas"
          actionLabel="Explore Ideas"
        />
      ) : (
        <ul className="space-y-4">
          {items.map(({ idea, myCommentCount, lastCommentedAt }) => (
            <li key={idea._id} className="card flex items-center gap-4 p-4">
              <Link
                href={`/ideas/${idea._id}`}
                className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:block dark:bg-neutral-800"
              >
                {idea.imageURL ? (
                  <Image src={idea.imageURL} alt={idea.title} fill sizes="96px" className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center text-2xl">💡</span>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <span className="chip mb-1">{idea.category}</span>
                <Link href={`/ideas/${idea._id}`} className="block truncate font-semibold hover:text-brand-600">
                  {idea.title}
                </Link>
                <p className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <FiMessageSquare className="h-3.5 w-3.5" />
                    {myCommentCount} comment{myCommentCount > 1 ? 's' : ''}
                  </span>
                  <span>last {timeAgo(lastCommentedAt)}</span>
                </p>
              </div>

              <Link
                href={`/ideas/${idea._id}`}
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 transition-all sm:inline-flex dark:text-brand-400"
              >
                View <FiArrowRight />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
