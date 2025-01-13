import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const types = ['googleBusiness', 'googlePersonal', 'microsoftBusiness', 'microsoftPersonal'];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Count all email accounts for each seed account type
    const seedAccounts = await Promise.all(
      types.map(async (name) => {
        const amount = await db.collection('emailAccounts').countDocuments({
          espCamelCase: name,
          'webMail.status': 'ready',
          'webMail.routine': 'engagementAccount',
        });
        return { name, amount };
      })
    );

    return NextResponse.json(
      { seedAccounts },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('API Route Error:', error);

    return NextResponse.json(
      { error: error.message },
      {
        status: error.statusCode || 500,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  }
}
