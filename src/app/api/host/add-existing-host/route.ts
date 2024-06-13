import { ObjectId } from 'mongodb';

import { getUser } from 'src/auth/lib/mongodb/get-user';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const data = await request.json();
    const { hostName } = data;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);
   
    const user = await getUser()

     const host = await db.collection('hosts').findOne({ hostCrypt: hostName });

    if (!host) {
      return new Response(JSON.stringify({ error: 'This host does not exist' }), { status: 404 });
    }

    const hostId = host._id.toString();
    const userHostsIds = user.hosts.map((_id: ObjectId) => _id.toString());

    if (userHostsIds.includes(hostId)) {
      return new Response(JSON.stringify({ error: 'The host has already been added.' }), { status: 400 });
    }

    user.hosts.push(host._id);
    await db
      .collection('userSettings')
      .updateOne(
        { 'appLogin.username': session?.user.email },
        { $set: { hosts: user.hosts } }
      );

    return new Response(JSON.stringify({ message: 'Host added successfully' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
