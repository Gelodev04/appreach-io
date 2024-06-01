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
        throw { message: `Invalid id: ${id}`, statusCode: 400 };
      }

      const result = await db
        .collection('hosts')
        .deleteOne({ _id: ObjectId.createFromHexString(id) });
      if (result.deletedCount === 0) {
        throw {
          message: `Host with id: ${id} doesn't exist or was already deleted`,
          statusCode: 404,
        };
      }

      await db
        .collection('userSettings')
        .updateOne(
          { 'appLogin.username': 'michael@outreachmagic.io' },
          { $pull: { hosts: ObjectId.createFromHexString(id) as any } }
        );

      deletedIds.push(id);
    }

    return Response.json({ deletedIds });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
