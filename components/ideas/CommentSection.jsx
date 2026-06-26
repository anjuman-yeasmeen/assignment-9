'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FiSend, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { apiFetch } from '@/lib/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { timeAgo } from '@/lib/format';
import Spinner from '@/components/ui/Spinner';

export default function CommentSection({ ideaId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    apiFetch(`/api/ideas/${ideaId}/comments`)
      .then((data) => setComments(data.comments))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [ideaId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const data = await apiFetch(`/api/ideas/${ideaId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setComments((c) => [data.comment, ...c]);
      setText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const data = await apiFetch(`/api/comments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ text: editText }),
      });
      setComments((c) => c.map((cm) => (cm._id === id ? data.comment : cm)));
      setEditingId(null);
      toast.success('Comment updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await apiFetch(`/api/comments/${id}`, { method: 'DELETE' });
      setComments((c) => c.filter((cm) => cm._id !== id));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-xl font-bold">
        Discussion <span className="text-neutral-400">({comments.length})</span>
      </h2>

      <form onSubmit={addComment} className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          className="input flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your feedback on this idea…"
          maxLength={1000}
        />
        <button type="submit" className="btn-primary" disabled={posting || !text.trim()}>
          {posting ? <Spinner className="h-4 w-4" /> : <FiSend />} Post
        </button>
      </form>

      {loading ? (
        <div className="grid place-items-center py-10">
          <Spinner className="h-6 w-6" />
        </div>
      ) : comments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 py-10 text-center text-sm text-neutral-500 dark:border-neutral-700">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const mine = user && c.userId === user.id;
            return (
              <li key={c._id} className="card p-4">
                <div className="flex items-start gap-3">
                  {c.userPhoto ? (
                    <Image src={c.userPhoto} alt={c.userName} width={40} height={40}
                      className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 font-semibold text-white">
                      {c.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-sm">
                      <span className="font-semibold">{c.userName}</span>
                      <span className="text-xs text-neutral-400">{timeAgo(c.createdAt)}</span>
                      {c.updatedAt && c.updatedAt !== c.createdAt && (
                        <span className="text-xs text-neutral-400">(edited)</span>
                      )}
                    </div>

                    {editingId === c._id ? (
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <input
                          className="input flex-1"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(c._id)} className="btn-primary px-3 py-2 text-xs">
                            <FiCheck /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn-secondary px-3 py-2 text-xs">
                            <FiX /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-neutral-700 dark:text-neutral-300">
                        {c.text}
                      </p>
                    )}
                  </div>

                  {mine && editingId !== c._id && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => {
                          setEditingId(c._id);
                          setEditText(c.text);
                        }}
                        aria-label="Edit comment"
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(c._id)}
                        aria-label="Delete comment"
                        className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
