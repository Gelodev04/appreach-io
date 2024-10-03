import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const { id, password, token } = data;
    if (!id) throw new Error('Id is required');
    if (!token) throw new Error('Token is required');
    if (!password) throw new Error('Password is required');

    const user = await db
      .collection('userSettings')
      .findOne({ _id: ObjectId.createFromHexString(id) });
    if (!user) throw new Error('Could not find any user with the given id');
    if (user.resetPassword.token !== token) throw new Error('The token is invalid');

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.collection('userSettings').updateOne(
      { _id: ObjectId.createFromHexString(id) },
      {
        $set: {
          'appLogin.password': hashedPassword,
          'resetPassword.lastReset': new Date().toISOString(),
          // Clear the reset token and token expiration
          'resetPassword.token': null,
          'resetPassword.tokenExpiration': null,
          lastUpdated: new Date().toISOString(),
        },
      }
    );

    return Response.json({
      message: 'The password was reset successfully.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
