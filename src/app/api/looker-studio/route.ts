import { getUser } from 'src/auth/lib/mongodb/get-user';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { env } from 'src/data/env/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log({ env });
    const userSettings = await getUser();

    const userHosts = userSettings?.hosts || [];

    const client = await clientPromise;
    const db = client.db();

    const hostIds = userHosts.map((hostId: string) => new ObjectId(hostId));

    const totalAmount = await db.collection('webMail').countDocuments({
      'host.hostId': { $in: hostIds },
    });

    if (totalAmount === 0) {
      return NextResponse.json(
        {
          embedUrl: `${env.NEXT_PUBLIC_SAMPLE_LOOKER_URL}`,
          warningMessage:
            'Important: Your dashboard is currently displaying sample data. This will be replaced with real data once you begin sending emails.',
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    return NextResponse.json(
      { embedUrl: env.NEXT_PUBLIC_LIVE_LOOKER_URL },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
