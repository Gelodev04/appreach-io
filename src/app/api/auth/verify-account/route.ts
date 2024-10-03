import { ObjectId } from 'mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const { id, token } = data;
    if (!id) throw new Error('Id is required');
    if (!token) throw new Error('Token is required');

    const user = await db
      .collection('userSettings')
      .findOne({ _id: ObjectId.createFromHexString(id) });
    if (!user) throw new Error('Could not find any user with the given id');
    if (user.verification.token !== token) throw new Error('The token is invalid');

    await db.collection('userSettings').updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $set: {
          'appLogin.verified': true,
          'verification.verifiedOn': new Date().toISOString(),
          // Clear the reset token and token expiration
          'verification.token': null,
          'verification.tokenExpiration': null,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    return Response.json({
      message: 'Your account is now verified. You can proceed to log in.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
