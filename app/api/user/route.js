import { ObjectId } from 'mongodb';
import { usersCollection } from '@/lib/db';
import { publicUser } from '@/lib/auth';
import { requireAuth, ok, fail } from '@/lib/api';

// PATCH /api/user — update the logged-in user's profile (name, photo URL).
export async function PATCH(request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body) return fail('Invalid request body');

  const update = {};
  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return fail('Name cannot be empty');
    update.name = name;
  }
  if (body.photoURL !== undefined) {
    update.photoURL = String(body.photoURL).trim();
  }
  if (Object.keys(update).length === 0) return fail('Nothing to update');
  update.updatedAt = new Date();

  const users = await usersCollection();
  const _id = new ObjectId(user.id);
  await users.updateOne({ _id }, { $set: update });
  const updated = await users.findOne({ _id });

  return ok({ user: publicUser(updated) });
}
