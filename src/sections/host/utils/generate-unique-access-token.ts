import { nanoid } from 'nanoid';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';

export async function generateUniqueAccessToken(): Promise<string> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('hosts');

  const generate = async (): Promise<string> => {
    const token = nanoid(10);

    const found = await collection.findOne({
      $or: [{ 'token.access': token }, { 'token.history': token }],
    });

    return found ? await generate() : token;
  };

  return generate();
}
