import { ideasCollection, serializeIdea, CATEGORIES } from '@/lib/db';
import { requireAuth, ok, fail } from '@/lib/api';

// GET /api/ideas — public listing with search, category filter, sort and limit.
//   ?search=   case-insensitive match on title ($regex)
//   ?category= exact category filter
//   ?sort=trending|newest
//   ?limit=    cap the number of results (used by the home "Trending" section)
//   ?from= &to=  optional createdAt date range ($gte / $lte)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').trim();
  const category = (searchParams.get('category') || '').trim();
  const sort = searchParams.get('sort') || 'newest';
  const limit = Math.min(parseInt(searchParams.get('limit') || '0', 10) || 0, 100);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const query = {};
  if (search) {
    // Escape regex metacharacters so user input is treated literally.
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.title = { $regex: safe, $options: 'i' };
  }
  if (category && CATEGORIES.includes(category)) {
    query.category = category;
  }
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(`${to}T23:59:59.999Z`);
  }

  const sortSpec =
    sort === 'trending'
      ? { likes: -1, commentCount: -1, createdAt: -1 }
      : { createdAt: -1 };

  const ideas = await ideasCollection();
  let cursor = ideas.find(query).sort(sortSpec);
  if (limit) cursor = cursor.limit(limit);
  const docs = await cursor.toArray();

  return ok({ ideas: docs.map(serializeIdea) });
}

// POST /api/ideas — create an idea (authenticated).
export async function POST(request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body) return fail('Invalid request body');

  const required = {
    title: body.title,
    shortDescription: body.shortDescription,
    detailedDescription: body.detailedDescription,
    category: body.category,
    targetAudience: body.targetAudience,
    problemStatement: body.problemStatement,
    proposedSolution: body.proposedSolution,
  };
  for (const [key, value] of Object.entries(required)) {
    if (!value || !String(value).trim()) return fail(`${key} is required`);
  }
  if (!CATEGORIES.includes(body.category)) return fail('Invalid category');

  const now = new Date();
  const doc = {
    title: body.title.trim(),
    shortDescription: body.shortDescription.trim(),
    detailedDescription: body.detailedDescription.trim(),
    category: body.category,
    tags: Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : String(body.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    imageURL: (body.imageURL || '').trim(),
    estimatedBudget: (body.estimatedBudget || '').toString().trim(),
    targetAudience: body.targetAudience.trim(),
    problemStatement: body.problemStatement.trim(),
    proposedSolution: body.proposedSolution.trim(),
    authorId: user.id,
    authorName: user.name,
    authorPhoto: user.photoURL,
    likes: 0,
    commentCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const ideas = await ideasCollection();
  const result = await ideas.insertOne(doc);
  return ok({ idea: serializeIdea({ ...doc, _id: result.insertedId }) }, { status: 201 });
}
