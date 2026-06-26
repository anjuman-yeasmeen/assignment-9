'use client';

import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { apiFetch } from '@/lib/client';
import { CATEGORIES } from '@/lib/categories';
import IdeaCard from '@/components/ideas/IdeaCard';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function IdeasBrowser({ initialCategory = '', initialSearch = '' }) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('newest');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce the search box; refetch whenever a filter changes.
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (category) params.set('category', category);
      params.set('sort', sort);
      try {
        const data = await apiFetch(`/api/ideas?${params.toString()}`, {
          signal: controller.signal,
        });
        setIdeas(data.ideas);
      } catch (err) {
        if (err.name !== 'AbortError') setIdeas([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(run, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [search, category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Ideas</h1>
        <p className="mt-2 text-neutral-500">
          Search and filter through community-submitted startup ideas.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas by title…"
            className="input pl-10"
          />
        </div>
        <select className="input sm:w-48" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="trending">Trending</option>
        </select>
      </div>

      {loading ? (
        <div className="grid place-items-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      ) : ideas.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No ideas found"
          message="Try adjusting your search or filters, or share the first idea in this space."
          actionHref="/add-idea"
          actionLabel="Share an Idea"
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-neutral-500">
            {ideas.length} idea{ideas.length > 1 ? 's' : ''} found
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
