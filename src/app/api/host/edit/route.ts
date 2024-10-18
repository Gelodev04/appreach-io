import { ObjectId } from 'mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { getUser } from 'src/auth/lib/mongodb/get-user';
import { generateArrayAddresses } from 'src/sections/host/utils/generate-array-adresses';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      _id,
      externalSenderAddresses,
      inboxEngagement,
      notificationAddresses,
      slack,
      smartLead,
      timezone,
    } = data;

    const client = await clientPromise;
    const db = client.db();
    const user = await getUser();
    const currentHost = await db
      .collection('hosts')
      .findOne({ _id: ObjectId.createFromHexString(_id) });

    if (!currentHost) {
      return Response.json({ message: 'This host does not exist' }, { status: 404 });
    }

    const externalSenderAddressesArray = generateArrayAddresses(externalSenderAddresses);
    const notificationAddressesArray = generateArrayAddresses(notificationAddresses);

    // Check for duplicate external sender addresses across user hosts
    if (externalSenderAddressesArray.length > 0) {
      const userHosts = user.hosts as ObjectId[];
      const existingEmailHosts = await Promise.all(
        userHosts
          .filter((hostId) => String(hostId) !== _id) // Exclude current host from the check
          .map(async (hostId: ObjectId) => {
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
      if (duplicateEmail) {
        throw new Error(`Sender address is already used in host ${duplicateEmail.host}`);
      }
    }

    // Update the host with the new data
    await db.collection('hosts').updateOne(
      { _id: ObjectId.createFromHexString(_id) },
      {
        $set: {
          'userSettings.timezone': timezone,
          'userSettings.externalSenderAddresses': externalSenderAddressesArray,
          'userSettings.notificationAddressArray': notificationAddressesArray,
          slack,
          smartlead: smartLead,
          inboxEngagement,
        },
      }
    );

    return Response.json({ message: 'Host updated successfully' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
