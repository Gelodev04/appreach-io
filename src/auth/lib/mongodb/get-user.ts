import { auth } from 'src/auth/lib/mongodb/auth-mongodb';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function getUser() {
  const session = await auth();
  const username = session?.user.email;

  if (!username) {
    throw new Error('Access denied.')
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE || undefined);

  const userSettings = await db.collection('userSettings').findOne({ 'appLogin.username': username });

  if (!userSettings) {
    throw new Error('No user found with the provided username.');
  }

  return userSettings;
}
