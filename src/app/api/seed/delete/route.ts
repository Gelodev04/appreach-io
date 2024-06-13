import { ObjectId } from 'mongodb';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  const data = await request.json();
  const { ids } = data;

  if (!Array.isArray(ids) || !ids.every(id => typeof id === 'string')) {
    return new Response(JSON.stringify({ error: "Invalid input format" }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    const deletionPromises = ids.map(async (id) => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid Object Id: ${id}`);
      }

      const result = await db
        .collection('seedBatches')
        .deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        throw new Error(`Seed with id: ${id} doesn't exist or was already deleted`);
      }

      return id;
    });

    const deletedIds = await Promise.all(deletionPromises);

    return new Response(JSON.stringify({ deletedIds }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
