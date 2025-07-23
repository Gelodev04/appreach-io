import { getUser } from 'src/auth/lib/mongodb/get-user';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Demo Report Temporarily Remove
    // const userSettings = await getUser();

    // const userHosts = userSettings?.hosts || [];

    // const client = await clientPromise;
    // const db = client.db();

    // const hostIds = userHosts.map((hostId: string) => new ObjectId(hostId));

    // const totalAmount = await db.collection('webMail').countDocuments({
    //   'host.hostId': { $in: hostIds },
    // });

    // if (totalAmount === 0) {
    //   return NextResponse.json(
    //     {
    //       embedUrl: `${env.NEXT_PUBLIC_SAMPLE_LOOKER_URL}`,
    //       warningMessage:
    //         'Important: Your dashboard is currently displaying sample data. This will be replaced with real data once you begin sending emails.',
    //     },
    //     { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    //   );
    // }

    const userSettings = await getUser();
    const lookerStudioUrl = userSettings?.reporting?.looker_studio_url;

    return NextResponse.json(
      { embedUrl: lookerStudioUrl },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
