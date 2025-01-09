/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-await-in-loop */
import { NextRequest, NextResponse } from 'next/server';
import prisma from 'src/auth/lib/prisma/db-prisma';

// TODO: NOTES THIS IS AN API TO DELETE DUPLICATE RECORDS IN SENDERADDRESSES TABLE

// src/app/api/plan/check-plan/route.ts
export async function GET(req: NextRequest) {
  try {
    // Example: Extract query parameters from the request
    const duplicates = await prisma.senderAddresses.groupBy({
      by: ['hostId'],
      _count: {
        hostId: true,
      },
      having: {
        hostId: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const duplicate of duplicates) {
      const { hostId } = duplicate;
      const records = await prisma.senderAddresses.findMany({
        where: { hostId },
        select: { id: true, hostId: true },
      });

      const [retain, ...remove] = records;

      const idsToRemove = remove.map((record) => record.id);
      console.log({ idsToRemove });
      await prisma.senderAddresses.deleteMany({
        where: {
          id: {
            in: idsToRemove,
          },
        },
      });
    }

    // Return a successful response
    return NextResponse.json('Deleted', { status: 200 });
  } catch (error) {
    // Handle any errors that occur
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
