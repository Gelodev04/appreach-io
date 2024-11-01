import { auth } from 'auth';
import { NextResponse } from 'next/server';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { getActiveSubscription } from 'src/sections/subscription/utils/get-active-subscription';
import { mapStripePlanToMongoDB } from 'src/utils/stripe';

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user.email;
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();

    const { error, data } = await getActiveSubscription(email);
    if (error) return NextResponse.json({ error }, { status: 404 });
    const activeSubscription = data!;

    // Update active subscription into MongoDB
    await db
      .collection('userSettings')
      .updateOne(
        { 'appLogin.username': session?.user.email },
        { $set: { plan: mapStripePlanToMongoDB(activeSubscription) } }
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
