import { ObjectId } from 'mongodb';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const userSettings = await db
      .collection('userSettings')
      .findOne({ 'appLogin.username': 'michael@outreachmagic.io' });

    if (!userSettings) {
      throw { message: 'No user found with the provided username.', statusCode: 404 };
    }

    if (!userSettings.hosts || userSettings.hosts.length === 0) {
      throw {
        message:
          'No hosts found for the user. Please ensure the user has the necessary hosts configured.',
        statusCode: 404,
      };
    }

    let hosts = await Promise.all(
      userSettings.hosts.map(async (hostId: ObjectId) => db.collection('hosts').findOne({ _id: new ObjectId(hostId) }))
    );

    // Filter out null values
    hosts = hosts.filter((host) => host !== null);

    return Response.json({ hosts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
