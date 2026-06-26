import { ObjectId } from 'mongodb';
import { commentsCollection, ideasCollection, serializeComment } from '@/lib/db';
import { requireAuth, ok, fail } from '@/lib/api';

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// PATCH /api/comments/[id] — edit own comment.
export async function PATCH(request, ctx) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const _id = toObjectId(id);
  if (!_id) return fail('Comment not found', 404);

  const body = await request.json().catch(() => null);
  const text = (body?.text || '').trim();
  if (!text) return fail('Comment cannot be empty');

  const comments = await commentsCollection();
  const comment = await comments.findOne({ _id });
  if (!comment) return fail('Comment not found', 404);
  if (comment.userId !== user.id) return fail('You can only edit your own comments', 403);

  await comments.updateOne({ _id }, { $set: { text, updatedAt: new Date() } });
  const updated = await comments.findOne({ _id });
  return ok({ comment: serializeComment(updated) });
}

// DELETE /api/comments/[id] — delete own comment.
export async function DELETE(request, ctx) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const _id = toObjectId(id);
  if (!_id) return fail('Comment not found', 404);

  const comments = await commentsCollection();
  const comment = await comments.findOne({ _id });
  if (!comment) return fail('Comment not found', 404);
  if (comment.userId !== user.id) return fail('You can only delete your own comments', 403);

  await comments.deleteOne({ _id });
  const ideas = await ideasCollection();
  await ideas.updateOne({ _id: comment.ideaId }, { $inc: { commentCount: -1 } });

  return ok({ success: true });
}
