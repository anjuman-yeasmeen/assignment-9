import { ObjectId } from 'mongodb';
import { ideasCollection, commentsCollection, serializeIdea, CATEGORIES } from '@/lib/db';
import { requireAuth, ok, fail } from '@/lib/api';

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// GET /api/ideas/[id] — full idea details (private; page is protected by proxy).
export async function GET(request, ctx) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const _id = toObjectId(id);
  if (!_id) return fail('Idea not found', 404);

  const ideas = await ideasCollection();
  const idea = await ideas.findOne({ _id });
  if (!idea) return fail('Idea not found', 404);

  return ok({ idea: serializeIdea(idea), isOwner: idea.authorId === user.id });
}

// PATCH /api/ideas/[id] — update an idea (owner only).
export async function PATCH(request, ctx) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const _id = toObjectId(id);
  if (!_id) return fail('Idea not found', 404);

  const ideas = await ideasCollection();
  const idea = await ideas.findOne({ _id });
  if (!idea) return fail('Idea not found', 404);
  if (idea.authorId !== user.id) return fail('You can only edit your own ideas', 403);

  const body = await request.json().catch(() => null);
  if (!body) return fail('Invalid request body');

  const allowed = [
    'title',
    'shortDescription',
    'detailedDescription',
    'category',
    'imageURL',
    'estimatedBudget',
    'targetAudience',
    'problemStatement',
    'proposedSolution',
  ];
  const update = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = String(body[key]).trim();
  }
  if (update.category && !CATEGORIES.includes(update.category)) {
    return fail('Invalid category');
  }
  if (body.tags !== undefined) {
    update.tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : String(body.tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
  }
  update.updatedAt = new Date();

  await ideas.updateOne({ _id }, { $set: update });
  const updated = await ideas.findOne({ _id });
  return ok({ idea: serializeIdea(updated) });
}

// DELETE /api/ideas/[id] — delete an idea and its comments (owner only).
export async function DELETE(request, ctx) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const _id = toObjectId(id);
  if (!_id) return fail('Idea not found', 404);

  const ideas = await ideasCollection();
  const idea = await ideas.findOne({ _id });
  if (!idea) return fail('Idea not found', 404);
  if (idea.authorId !== user.id) return fail('You can only delete your own ideas', 403);

  await ideas.deleteOne({ _id });
  const comments = await commentsCollection();
  await comments.deleteMany({ ideaId: _id });

  return ok({ success: true });
}
