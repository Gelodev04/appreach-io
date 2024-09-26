import { NextResponse } from 'next/server';
import { paths } from 'src/routes/paths';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { priceId, customerEmail } = await request.json();

    if (!priceId || !customerEmail) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const baseUrl = request.headers.get('origin');

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7, // Free trial for 7 days
      },
      success_url: `${baseUrl}${paths.checkout.success}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${paths.checkout.root}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
