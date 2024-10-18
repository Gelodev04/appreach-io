import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE } from 'src/config-global';
import { type StripeSubscription } from 'src/types/stripe';
import { endpoints } from './swr';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export async function createCheckoutSession(
  priceId: string,
  customerEmail: string
): Promise<string> {
  const stripe: Stripe | null = await stripePromise;
  if (!stripe) throw new Error('Stripe.js failed to load.');

  const res = await fetch(endpoints.stripe.checkoutSession, {
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

export async function fetchUserSubscription(
  email: string
): Promise<StripeSubscription | undefined> {
  const url = endpoints.stripe.subscriptions;
  const body = JSON.stringify({ email });
  const response = await fetch(url, { method: 'POST', body });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData?.error || 'Failed to fetch subscription details.');
  }

  return responseData || {};
}

export function getSubscriptionData(productId: string) {
  const subscriptionList = Object.entries(STRIPE.subscriptions);
  const subscription = subscriptionList.find(([_, item]) => item.product === productId);

  return subscription ? subscription[1] : undefined;
}
