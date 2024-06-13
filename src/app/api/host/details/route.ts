import { ObjectId } from 'mongodb';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('hostId');
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    if (!id || !ObjectId.isValid(id)) {
      return Response.json({ error: "This host doesn't exist or was deleted" }, { status: 404 });
    }

    const host = await db.collection('hosts').findOne({ _id: new ObjectId(id) });

    if (!host) {
      return Response.json({ error: "This host doesn't exist or was deleted" }, { status: 404 });
    }

    return Response.json({ host });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
