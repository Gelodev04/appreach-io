import { ObjectId } from 'mongodb';

import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  const data = await request.json();
  const { ids } = data;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);
    const session = await auth();

    // Validate all IDs first to avoid partial deletion if any ID is invalid
    const invalidId = ids.find((id: string) => !ObjectId.isValid(id));
    if (invalidId) {
      return Response.json({ error: `Invalid id: ${invalidId}` }, { status: 400 });
    }

    // Use Promise.all to delete hosts and update userSettings in parallel
    const deleteOperations = ids.map((id: string) =>
      db.collection('hosts').deleteOne({ _id: ObjectId.createFromHexString(id) })
    );
    const deleteResults = await Promise.all(deleteOperations);

    const updateOperations = ids.map((id: string) =>
      db.collection('userSettings').updateOne(
        { 'appLogin.username': session?.user.email },
        { $pull: { hosts: ObjectId.createFromHexString(id) as any } }
      )
    );
    await Promise.all(updateOperations);

    // Filter out IDs that were not deleted (i.e., deletedCount === 0)
    const deletedIds = ids.filter((id: string, index: number) => deleteResults[index].deletedCount > 0);

    if (deletedIds.length === 0) {
      return Response.json({ error: `Hosts don't exist or were already deleted` }, { status: 400 });
    }

    return Response.json({ deletedIds });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}