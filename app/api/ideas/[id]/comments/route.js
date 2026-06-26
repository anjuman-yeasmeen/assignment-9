import { ObjectId } from 'mongodb';
import { ideasCollection, commentsCollection, serializeComment } from '@/lib/db';
import { requireAuth, ok, fail } from '@/lib/api';

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// GET /api/ideas/[id]/comments — list comments for an idea (authenticated).
export async function GET(request, ctx) {
  const { response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const ideaId = toObjectId(id);
  if (!ideaId) return fail('Idea not found', 404);

  const comments = await commentsCollection();
  const docs = await comments.find({ ideaId }).sort({ createdAt: -1 }).toArray();
  return ok({ comments: docs.map(serializeComment) });
}

// POST /api/ideas/[id]/comments — add a comment (authenticated).
export async function POST(request, ctx) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const { id } = await ctx.params;
  const ideaId = toObjectId(id);
  if (!ideaId) return fail('Idea not found', 404);

  const body = await request.json().catch(() => null);
  const text = (body?.text || '').trim();
  if (!text) return fail('Comment cannot be empty');

  const ideas = await ideasCollection();
  const idea = await ideas.findOne({ _id: ideaId });
  if (!idea) return fail('Idea not found', 404);

  const now = new Date();
  const doc = {
    ideaId,
    ideaTitle: idea.title,
    userId: user.id,
    userName: user.name,
    userPhoto: user.photoURL,
    text,
    createdAt: now,
    updatedAt: now,
  };
  const comments = await commentsCollection();
  const result = await comments.insertOne(doc);
  await ideas.updateOne({ _id: ideaId }, { $inc: { commentCount: 1 } });

  return ok({ comment: serializeComment({ ...doc, _id: result.insertedId }) }, { status: 201 });
}
