import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from 'src/data/env/server';
import { paths } from 'src/routes/paths';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { priceId, customerEmail, customAmount } = await request.json();

    if (!customerEmail || !priceId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const baseUrl = headers().get('origin');

    // Create a single checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'One-time Upgrade fee',
            },
            unit_amount: customAmount * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}${paths.checkout.success}?session_type=one_time&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${paths.checkout.root}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
