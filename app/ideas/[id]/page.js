'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiDollarSign, FiTarget, FiUser } from 'react-icons/fi';
import { apiFetch } from '@/lib/client';
import { formatDate } from '@/lib/format';
import { PageSpinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import CommentSection from '@/components/ideas/CommentSection';
import usePageTitle from '@/components/ui/usePageTitle';

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageTitle(idea?.title || 'Idea Details');

  useEffect(() => {
    apiFetch(`/api/ideas/${id}`)
      .then((data) => setIdea(data.idea))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSpinner label="Loading idea…" />;

  if (error || !idea) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon="🚫"
          title="Idea not found"
          message={error || 'This idea may have been removed.'}
          actionHref="/ideas"
          actionLabel="Back to Ideas"
        />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/ideas"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-brand-600"
      >
        <FiArrowLeft /> Back to Ideas
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="chip">{idea.category}</span>
        {idea.tags?.map((t) => (
          <span key={t} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            #{t}
          </span>
        ))}
      </div>

      <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{idea.title}</h1>
      <p className="mt-3 text-lg text-neutral-500">{idea.shortDescription}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-500">
        <span className="inline-flex items-center gap-1.5">
          <FiUser className="h-4 w-4" /> {idea.authorName}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiCalendar className="h-4 w-4" /> {formatDate(idea.createdAt)}
        </span>
        {idea.estimatedBudget && (
          <span className="inline-flex items-center gap-1.5">
            <FiDollarSign className="h-4 w-4" /> {idea.estimatedBudget}
          </span>
        )}
      </div>

      {idea.imageURL && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <Image src={idea.imageURL} alt={idea.title} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" />
        </div>
      )}

      <div className="mt-8 space-y-8">
        <Section title="Overview">{idea.detailedDescription}</Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <InfoCard icon={<FiTarget />} title="Target Audience">{idea.targetAudience}</InfoCard>
          <InfoCard icon={<FiDollarSign />} title="Estimated Budget">
            {idea.estimatedBudget || 'Not specified'}
          </InfoCard>
        </div>
        <Section title="Problem Statement">{idea.problemStatement}</Section>
        <Section title="Proposed Solution">{idea.proposedSolution}</Section>
      </div>

      <hr className="my-10 border-neutral-200 dark:border-neutral-800" />
      <CommentSection ideaId={id} />
    </article>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </p>
    </div>
  );
}

function InfoCard({ icon, title, children }) {
  return (
    <div className="card p-5">
      <div className="mb-2 flex items-center gap-2 text-brand-600 dark:text-brand-400">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      <p className="text-sm text-neutral-700 dark:text-neutral-300">{children}</p>
    </div>
  );
}
