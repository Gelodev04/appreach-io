import { ObjectId } from 'mongodb';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';

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
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    const currentHost = await db
      .collection('hosts')
      .findOne({ _id: ObjectId.createFromHexString(_id) });

    if (!currentHost) {
    return Response.json({ message: 'This host does not exist' }, { status: 404 });
    }

    const externalSenderAddressesArray = externalSenderAddresses.split('\n');
    const notificationAddressesArray = notificationAddresses.split('\n');

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
