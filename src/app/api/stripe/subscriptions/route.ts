import { auth } from 'auth';
import { NextResponse } from 'next/server';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { UserSubscriptionPlan } from 'src/types/stripe';

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user.email;
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('userSettings').findOne({ 'appLogin.username': email });

    if (!user?.plan) {
      return NextResponse.json({ error: 'User does not have a subscription' }, { status: 404 });
    }

    return NextResponse.json(user.plan as UserSubscriptionPlan);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
