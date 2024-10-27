import { auth } from 'auth';
import { fromUnixTime } from 'date-fns';
import { NextResponse } from 'next/server';
import clientPromise from 'src/auth/lib/mongodb/db-mongo';
import { StripeSubscription } from 'src/types/stripe';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function GET() {
  try {
    const session = await auth();
    const email = session?.user.email;
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db();
    const customer = await stripe.customers.list({ email, limit: 1 });
    if (customer.data.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 404 });
    }

    // Find the active subscription
    const activeSubscription = subscriptions.data.find(({ status }) =>
      ['active', 'trialing'].includes(status)
    ) as StripeSubscription | undefined;

    if (!activeSubscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Update active subscription into MongoDB
    const stripeObject = {
      id: activeSubscription.plan.id,
      status: activeSubscription.status,
      amount: activeSubscription.plan.amount,
      amount_decimal: activeSubscription.plan.amount_decimal,
      start_date: fromUnixTime(activeSubscription.start_date).toISOString(),
    };
    await db
      .collection('userSettings')
      .updateOne({ 'appLogin.username': session?.user.email }, { $set: { stripe: stripeObject } });

    return NextResponse.json(activeSubscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
