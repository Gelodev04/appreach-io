import { ObjectId } from 'mongodb';
import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { getUser } from 'src/auth/lib/mongodb/get-user';
import { generateHostCrypt, generateLookerStudioUrl } from 'src/sections/host/utils';
import { generateArrayAddresses } from 'src/sections/host/utils/generate-array-adresses';

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
    const db = client.db();
    const session = await auth();
    const user = await getUser();

    // Check if a host with the same name already exists
    const existingHost = await db.collection('hosts').findOne({ host });
    if (existingHost) throw new Error('Profile already created, use different name');

    // Check for duplicate external sender addresses across user hosts
    const userHosts = user.hosts as ObjectId[];
    const externalSenderAddressesArray = generateArrayAddresses(externalSenderAddresses);

    const existingEmailHosts = await Promise.all(
      userHosts.map(async (hostId: ObjectId) => {
        const hostDoc = await db.collection('hosts').findOne({ _id: hostId });
        const hostDocExternalSenderAddresses = hostDoc?.userSettings?.externalSenderAddresses;
        if (!hostDocExternalSenderAddresses) return null;

        const hasDuplicateEmail = externalSenderAddressesArray.some((email) => {
          return hostDocExternalSenderAddresses.includes(email.toLowerCase());
        });

        return hasDuplicateEmail ? hostDoc : null;
      })
    );

    const duplicateEmail = existingEmailHosts.find((h) => h !== null);
    if (duplicateEmail) throw new Error('Cannot save, sender address already in use.');

    const hostCrypt = generateHostCrypt(host);
    const lookerStudioUrl = generateLookerStudioUrl([hostCrypt]);
    const notificationAddressesArray = generateArrayAddresses(notificationAddresses);

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
      .updateOne({ 'appLogin.username': session?.user.email }, { $set: { hosts: user.hosts } });

    return Response.json({ message: 'Host created and added to user settings successfully' });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
