'use server';

import { env } from 'src/data/env/server';

import Stripe from 'stripe';
import { paths } from 'src/routes/paths';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getUserSettings } from '../db/user-settings';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '');

export const getCurrentPlan = async () => {
  const { plan } = await getUserSettings({ plan: true });
  revalidatePath(paths.checkout.root);
  revalidateTag('current-subscription'); // Add this line to prevent caching
  return plan;
};

export const getSubscriptionsById = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return subscription;
  } catch (error) {
    console.log('Unable to retrieve subscriptions');
    throw new Error(error);
  }
};

export const updateSubcription = async (subscriptionId: string, newPriceId: string) => {
  try {
    const currentSubscription = await getSubscriptionsById(subscriptionId);
    const subscriptionItemId = currentSubscription.items.data[0].id; // Assuming you want to update the first item
    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId, // The subscription item ID
          price: newPriceId, // The new price ID to update to
        },
      ],
      proration_behavior: 'always_invoice', // Options: 'create_prorations', 'none', 'always_invoice'
    });
    revalidatePath(paths.checkout.root);
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error(error);
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    if (!subscriptionId) {
      throw new Error('No subscription id found.');
    }

    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    revalidatePath(paths.checkout.root);
    revalidateTag('current-subscription'); // Add this line to prevent caching
    return canceledSubscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error(error);
  }
};
