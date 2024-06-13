import axios from 'axios';
import { ObjectId } from 'mongodb';

import clientPromise from 'src/auth/lib/mongodb/db-mongo';

import { generateRandomChars } from 'src/sections/host/utils/generate-host-crypt';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      name,
      hostId,
      googleBusiness,
      googlePersonal,
      microsoftBusiness,
      microsoftPersonal,
      yahooPersonal,
      totalSeedAccounts
    } = data;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || undefined);

    await db.collection('seedBatches').insertOne({
      name,
      dateAdded: new Date(),
      generate: {
        total: totalSeedAccounts,
        esps: {
          googleBusiness,
          googlePersonal,
          microsoftBusiness,
          microsoftPersonal,
          yahooPersonal
        },
        type: 'engagement'
      },
      hostId: new ObjectId(hostId.value),
      status: 'ready',
      token: generateRandomChars()
    })

    await axios.post(process.env.SEED_EMAIL_GENERATOR as string)

    return Response.json({ message: 'Seed batch created successfully' });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: error.statusCode || 500 });
  }
}
