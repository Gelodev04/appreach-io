'use server';

import { revalidatePath } from 'next/cache';
import { env } from 'src/data/env/server';
import { paths } from 'src/routes/paths';
import Stripe from 'stripe';
import { getUserSettings } from '../db/user-settings';

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '');

export const getCurrentSubscription = async () => {
  const { plan } = await getUserSettings({ plan: true });
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
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId, // The subscription item ID
          price: newPriceId, // The new price ID to update to
        },
      ],
      proration_behavior: 'always_invoice', // Options: 'create_prorations', 'none', 'always_invoice'
    });
    /* if (updatedSubscription) {
      const id = updatedSubscription?.latest_invoice as string;
      const invoice = await stripe.invoices.retrieve(id);
      if (invoice) {
        const proratedAmount = invoice.amount_due; // This will give you the prorated amount
        console.log('Prorated Amount:', proratedAmount);
      } else {
        console.log('No invoice found for the updated subscription');
      }
    } */
    revalidatePath(paths.checkout.root);
    return !!updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};
