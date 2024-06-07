import { ObjectId } from 'mongodb';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  const data = await request.json();
  const { ids } = data;

  try {
    const client = await clientPromise;
    const db = client.db();

    const deletedIds = [];
    for (const id of ids) {
      if (!ObjectId.isValid(id)) {
        return Response.json({ error: "Invalid Object Id" }, { status: 400 });
      }

      const result = await db
        .collection('seedBatches')
        .deleteOne({ _id: ObjectId.createFromHexString(id) });
      if (result.deletedCount === 0) {
        throw {
          message: `Seed with id: ${id} doesn't exist or was already deleted`,
          statusCode: 404,
        };
      }

      deletedIds.push(id);
    }

    return Response.json({ deletedIds });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
