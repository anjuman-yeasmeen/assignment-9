import { getDb } from './mongodb';

export { CATEGORIES } from './categories';

// Centralized accessors for the three collections used across the app.
export async function usersCollection() {
  const db = await getDb();
  return db.collection('users');
}

export async function ideasCollection() {
  const db = await getDb();
  return db.collection('ideas');
}

export async function commentsCollection() {
  const db = await getDb();
  return db.collection('comments');
}

// Strip server-only fields and normalize ObjectId/Date to JSON-friendly values
// before returning a document to the client.
export function serializeIdea(idea) {
  if (!idea) return null;
  return {
    ...idea,
    _id: idea._id.toString(),
    createdAt: idea.createdAt ? new Date(idea.createdAt).toISOString() : null,
    updatedAt: idea.updatedAt ? new Date(idea.updatedAt).toISOString() : null,
  };
}

export function serializeComment(comment) {
  if (!comment) return null;
  return {
    ...comment,
    _id: comment._id.toString(),
    ideaId: comment.ideaId?.toString?.() ?? comment.ideaId,
    createdAt: comment.createdAt ? new Date(comment.createdAt).toISOString() : null,
    updatedAt: comment.updatedAt ? new Date(comment.updatedAt).toISOString() : null,
  };
}
