import prisma from 'prisma/db';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const id = new ObjectId('654e6256f77c17838f12e476');

  try {
    const userSettings = await prisma.UserSettings.findUnique({
      where: {
        id: id.toHexString(),
      },
    });

    // const userSettings = await prisma.UserSettings.findMany();

    console.log('user settings: ', userSettings);

    if (!userSettings) {
      return Response.json({ error: 'User not found' });
    }

    return Response.json(userSettings);
  } catch (error) {
    return Response.json({ error: 'Something went wrong' });
  }
}
