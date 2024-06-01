import { ObjectId } from 'mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { hostName } = data;
    const client = await clientPromise;
    const db = client.db();

    const host = await db.collection('hosts').findOne({ hostCrypt: hostName });

    if (!host) {
      throw { message: 'This host does not exist', statusCode: 404 };
    }

    const user = await db
      .collection('userSettings')
      .findOne({ 'appLogin.username': 'michael@outreachmagic.io' });

    if (!user) {
      throw { message: 'User not found', statusCode: 404 };
    }

    const hostId = host._id.toString();
    const userHostsIds = user.hosts.map((_id: ObjectId) => _id.toString());

    if (userHostsIds.includes(hostId)) {
      throw { message: 'The host has already been added.', statusCode: 400 };
    }

    user.hosts.push(host._id);
    await db
      .collection('userSettings')
      .updateOne(
        { 'appLogin.username': 'michael@outreachmagic.io' },
        { $set: { hosts: user.hosts } }
      );

    return new Response(JSON.stringify({ message: 'Host added successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.statusCode || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
