import { auth } from 'auth';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function DELETE() {
  try {
    const session = await auth();
    const email = session?.user.email;
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

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
    );

    if (!activeSubscription) throw new Error('No active subscription found');
    await stripe.subscriptions.cancel(activeSubscription.id);

    return NextResponse.json(activeSubscription);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
