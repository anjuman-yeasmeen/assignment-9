import { ideasCollection, serializeIdea } from '@/lib/db';
import { requireAuth, ok } from '@/lib/api';

// GET /api/my-ideas — ideas created by the logged-in user.
export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;

  const ideas = await ideasCollection();
  const docs = await ideas.find({ authorId: user.id }).sort({ createdAt: -1 }).toArray();
  return ok({ ideas: docs.map(serializeIdea) });
}
