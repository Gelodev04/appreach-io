import { loadStripe, Stripe } from '@stripe/stripe-js';
import { fromUnixTime } from 'date-fns';
import { STRIPE } from 'src/config-global';
import { SubscriptionData, type StripeSubscription } from 'src/types/stripe';
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

export async function fetchUserSubscription(): Promise<StripeSubscription | undefined> {
  const url = endpoints.stripe.subscriptions;
  const response = await fetch(url, { method: 'POST' });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData?.error || 'Failed to fetch subscription details.');
  }

  return responseData as StripeSubscription;
}

export function getSubscriptionData(productId: string): SubscriptionData | undefined {
  const subscriptionList = Object.entries(STRIPE.subscriptions);
  const subscription = subscriptionList.find(([_, item]) => item.product === productId);

  return subscription ? subscription[1] : undefined;
}

export function mapStripePlanToMongoDB(subscription: StripeSubscription): any {
  const subscriptionData = getSubscriptionData(subscription.plan.product);
  return {
    price_id: subscription.plan.id,
    subscription_id: subscription.id,
    amount: subscription.plan.amount,
    amount_decimal: subscription.plan.amount_decimal,
    lookup_key: subscriptionData?.name?.toLowerCase() ?? '',
    start_date: fromUnixTime(subscription.start_date),
    current_period_end: fromUnixTime(subscription.current_period_end),
    status: subscription.status,
  };
}
