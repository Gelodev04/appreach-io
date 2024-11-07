import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { subscriptionId, newPriceId } = await request.json();

    if (!subscriptionId || !newPriceId) {
      return NextResponse.json({ error: 'Missing subscriptionId or newPriceId' }, { status: 400 });
    }

    // Retrieve the current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Modify the subscription to downgrade at the end of the current billing cycle
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id, // The subscription item ID
          price: newPriceId, // The new price ID for the downgraded plan
        },
      ],
      proration_behavior: 'none', // No proration, change will take effect next cycle
      billing_cycle_anchor: 'unchanged', // Keep the current billing cycle anchor
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
