'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/client';
import IdeaCard from '@/components/ideas/IdeaCard';
import IdeaForm from '@/components/ideas/IdeaForm';
import Modal from '@/components/ui/Modal';
import Spinner, { PageSpinner } from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import usePageTitle from '@/components/ui/usePageTitle';

export default function MyIdeasPage() {
  usePageTitle('My Ideas');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    apiFetch('/api/my-ideas')
      .then((data) => setIdeas(data.ideas))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      const data = await apiFetch(`/api/ideas/${editing._id}`, {
        method: 'PATCH',
        body: JSON.stringify(form),
      });
      setIdeas((list) => list.map((i) => (i._id === data.idea._id ? data.idea : i)));
      setEditing(null);
      toast.success('Idea updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await apiFetch(`/api/ideas/${deleting._id}`, { method: 'DELETE' });
      setIdeas((list) => list.filter((i) => i._id !== deleting._id));
      setDeleting(null);
      toast.success('Idea deleted');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner label="Loading your ideas…" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Ideas</h1>
        <p className="mt-2 text-neutral-500">Manage the startup ideas you’ve shared.</p>
      </header>

      {ideas.length === 0 ? (
        <EmptyState
          icon="💡"
          title="You haven’t shared any ideas yet"
          message="Your submitted ideas will appear here. Share your first concept with the community."
          actionHref="/add-idea"
          actionLabel="Add Your First Idea"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea._id} idea={idea} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => !saving && setEditing(null)} title="Edit Idea" maxWidth="max-w-2xl">
        {editing && (
          <IdeaForm initial={editing} onSubmit={handleUpdate} submitLabel="Save Changes" submitting={saving} />
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleting} onClose={() => !saving && setDeleting(null)} title="Delete Idea" maxWidth="max-w-md">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{deleting?.title}</span>? This also removes its comments
          and cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setDeleting(null)} disabled={saving}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleDelete} disabled={saving}>
            {saving && <Spinner className="h-4 w-4" />} Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
