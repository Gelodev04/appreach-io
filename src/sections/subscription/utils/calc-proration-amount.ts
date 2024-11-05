'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export const calcProrationAmount = async (
  subscriptionId: string,
  newPriceId: string
): Promise<number> => {
  try {
    // Retrieve the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Preview the upcoming invoice with the proposed changes
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      // customer: subscription.customer,
      subscription: subscription.id,
      subscription_items: [
        {
          id: subscription.items.data[0].id, // Subscription item ID
          price: newPriceId, // New price ID
        },
      ],
      subscription_proration_behavior: 'create_prorations', // Handle proration
      subscription_billing_cycle_anchor: 'now', // Set the billing cycle to 'now'
    });

    // Step 3: Calculate the proration amount
    let prorationAmount = 0;
    upcomingInvoice.lines.data.forEach((line) => {
      if (line.proration) {
        prorationAmount += line.amount;
      }
    });

    // Convert from cents to dollars
    prorationAmount /= 100;

    return prorationAmount;
  } catch (error) {
    console.error('Error retrieving upcoming invoice:', error);
    return 0; // Return a default value in case of error
  }
};
