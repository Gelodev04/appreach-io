import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE } from 'src/config-global';
import { SubscriptionData } from 'src/types/stripe';
import { env } from 'src/data/env';
import { endpoints } from './swr';

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export async function createCheckoutSession(
  customerEmail: string,
  priceId?: string,
  customAmount?: number
): Promise<string> {
  const stripe: Stripe | null = await stripePromise;
  if (!stripe) throw new Error('Stripe.js failed to load.');

  const res = await fetch(endpoints.stripe.checkoutSession, {
    method: 'POST',
    body: JSON.stringify({ priceId, customerEmail, customAmount }),
  });

  const data = await res.json();
  if (!res.ok || !data.sessionId) {
    throw new Error('Failed to create Stripe session.');
  }

  return data.sessionId;
}

export async function createSubscriptionSession(
  customerEmail: string,
  priceId?: string
): Promise<string> {
  const stripe: Stripe | null = await stripePromise;
  if (!stripe) throw new Error('Stripe.js failed to load.');

  const res = await fetch(endpoints.stripe.createSubscription, {
    method: 'POST',
    body: JSON.stringify({ priceId, customerEmail }),
  });

  const data = await res.json();
  if (!res.ok || !data.sessionId) {
    throw new Error('Failed to create Stripe session.');
  }

  return data.sessionId;
}

export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe: Stripe | null = await stripePromise;
  if (!stripe) throw new Error('Stripe.js failed to load.');

  const result = await stripe.redirectToCheckout({ sessionId });
  if (result.error) {
    throw new Error(result.error.message || 'An error occurred');
  }
}

export function getSubscriptionData(priceId: string): SubscriptionData | undefined {
  const subscriptionList = Object.entries(STRIPE.subscriptions);
  const subscription = subscriptionList.find(([_, item]) => item.priceId === priceId);

  return subscription ? subscription[1] : undefined;
}
