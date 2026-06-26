'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import Spinner from '@/components/ui/Spinner';

const empty = {
  title: '',
  shortDescription: '',
  detailedDescription: '',
  category: '',
  tags: '',
  imageURL: '',
  estimatedBudget: '',
  targetAudience: '',
  problemStatement: '',
  proposedSolution: '',
};

// Shared by the Add Idea page and the My Ideas edit modal.
export default function IdeaForm({ initial, onSubmit, submitLabel = 'Submit', submitting }) {
  const [form, setForm] = useState(() => ({
    ...empty,
    ...initial,
    tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : initial?.tags || '',
  }));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Idea Title *</label>
        <input className="input" value={form.title} onChange={set('title')} required
          placeholder="e.g. AI-powered meal planner for busy parents" />
      </div>

      <div>
        <label className="label">Short Description *</label>
        <input className="input" value={form.shortDescription} onChange={set('shortDescription')}
          required placeholder="One-line summary shown on idea cards" />
      </div>

      <div>
        <label className="label">Detailed Description *</label>
        <textarea className="input min-h-28" value={form.detailedDescription}
          onChange={set('detailedDescription')} required
          placeholder="Describe your idea in depth" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Category *</label>
          <select className="input" value={form.category} onChange={set('category')} required>
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tags <span className="text-neutral-400">(comma separated, optional)</span></label>
          <input className="input" value={form.tags} onChange={set('tags')}
            placeholder="saas, mobile, b2c" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">Image URL</label>
          <input className="input" type="url" value={form.imageURL} onChange={set('imageURL')}
            placeholder="https://…" />
        </div>
        <div>
          <label className="label">Estimated Budget <span className="text-neutral-400">(optional)</span></label>
          <input className="input" value={form.estimatedBudget} onChange={set('estimatedBudget')}
            placeholder="e.g. $50,000" />
        </div>
      </div>

      <div>
        <label className="label">Target Audience *</label>
        <input className="input" value={form.targetAudience} onChange={set('targetAudience')}
          required placeholder="Who is this idea for?" />
      </div>

      <div>
        <label className="label">Problem Statement *</label>
        <textarea className="input min-h-24" value={form.problemStatement}
          onChange={set('problemStatement')} required placeholder="What problem does it solve?" />
      </div>

      <div>
        <label className="label">Proposed Solution *</label>
        <textarea className="input min-h-24" value={form.proposedSolution}
          onChange={set('proposedSolution')} required placeholder="How does your idea solve it?" />
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
        {submitting && <Spinner className="h-4 w-4" />}
        {submitLabel}
      </button>
    </form>
  );
}
