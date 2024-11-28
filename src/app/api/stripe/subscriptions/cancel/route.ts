import { auth } from 'auth';
import { NextResponse } from 'next/server';
import { env } from 'src/data/env/server';
import { getActiveSubscription } from 'src/sections/subscription/utils/get-active-subscription';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function DELETE() {
  try {
    const session = await auth();
    const email = session?.user.email;
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const { error, data } = await getActiveSubscription(email);
    if (error) return NextResponse.json({ error }, { status: 404 });
    const activeSubscription = data!;

    // Cancel the subscription
    await stripe.subscriptions.cancel(activeSubscription.id);

    return NextResponse.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
