'use server';

import { env } from 'src/data/env';
import { StripeSubscription } from 'src/types/stripe';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const ACTIVE_STATUSES: Stripe.Subscription.Status[] = ['active', 'trialing'];

export const getActiveSubscription = async (
  email: string
): Promise<{ error?: string; data?: StripeSubscription }> => {
  const customer = await stripe.customers.list({ email, limit: 1 });
  if (customer.data.length === 0) return { error: 'Customer not found' };

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.data[0].id,
    status: 'all',
    expand: ['data.default_payment_method'],
  });

  if (subscriptions.data.length === 0) return { error: 'No subscriptions found' };

  // Find the active subscription
  const activeSubscription = subscriptions.data.find(({ status }) => {
    return ACTIVE_STATUSES.includes(status);
  }) as StripeSubscription | undefined;

  if (!activeSubscription) return { error: 'No active subscription found' };
  return { data: activeSubscription };
};
