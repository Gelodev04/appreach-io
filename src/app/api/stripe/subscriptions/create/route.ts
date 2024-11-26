import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from 'src/data/env';
import { paths } from 'src/routes/paths';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { priceId, customerEmail } = await request.json();

    if (!customerEmail || !priceId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const baseUrl = headers().get('origin');

    // Prepare the session parameters, ensuring proration is not applied and the subscription starts one month from now
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}${paths.checkout.success}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${paths.checkout.root}`,
    };

    // Create a single checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
