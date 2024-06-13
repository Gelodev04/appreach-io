import { getUser } from 'src/auth/lib/mongodb/get-user';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

import { generateHostCrypt, generateLookerStudioUrl } from 'src/sections/host/utils';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      host,
      externalSenderAddresses,
      inboxEngagement,
      notificationAddresses,
      slack,
      smartLead,
      timezone,
    } = data;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);
    const session = await auth();

    const user = await getUser()

    const hostCrypt = generateHostCrypt(host);
    const lookerStudioUrl = generateLookerStudioUrl(hostCrypt);
    const externalSenderAddressesArray = externalSenderAddresses.split('\n');
    const notificationAddressesArray = notificationAddresses.split('\n');

    // Create a new host and get the _id of the new document
    const result = await db.collection('hosts').insertOne({
      host,
      hostCrypt,
      userSettings: {
        timezone,
        externalSenderAddresses: externalSenderAddressesArray,
        notificationAddressArray: notificationAddressesArray,
      },
      lookerStudio: { embedUrl: lookerStudioUrl, hasToRegenerate: false },
      slack,
      smartlead: smartLead,
      inboxEngagement,
    });

    const newHostId = result.insertedId;

    // Add the new _id to the hosts array in the userSettings document
    user.hosts.push(newHostId);
    await db
      .collection('userSettings')
      .updateOne(
        { 'appLogin.username': session?.user.email },
        { $set: { hosts: user.hosts } }
      );

    return Response.json({ message: 'Host created and added to user settings successfully' });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
