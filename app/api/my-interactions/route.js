import { ObjectId } from 'mongodb';
import { commentsCollection, ideasCollection, serializeIdea } from '@/lib/db';
import { requireAuth, ok } from '@/lib/api';

// GET /api/my-interactions — ideas the user has commented on, with how many
// comments they left and when they last commented.
export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  const comments = await commentsCollection();
  const grouped = await comments
    .aggregate([
      { $match: { userId: user.id } },
      {
        $group: {
          _id: '$ideaId',
          count: { $sum: 1 },
          lastCommentedAt: { $max: '$createdAt' },
        },
      },
      { $sort: { lastCommentedAt: -1 } },
    ])
    .toArray();

  const ideaIds = grouped.map((g) => g._id).filter(Boolean);
  const ideas = await ideasCollection();
  const docs = await ideas.find({ _id: { $in: ideaIds.map((i) => new ObjectId(i)) } }).toArray();
  const ideaMap = new Map(docs.map((d) => [d._id.toString(), d]));

  // Preserve the "most recently commented" ordering; skip deleted ideas.
  const interactions = grouped
    .map((g) => {
      const idea = ideaMap.get(g._id?.toString());
      if (!idea) return null;
      return {
        idea: serializeIdea(idea),
        myCommentCount: g.count,
        lastCommentedAt: g.lastCommentedAt ? new Date(g.lastCommentedAt).toISOString() : null,
      };
    })
    .filter(Boolean);

  return ok({ interactions });
}
