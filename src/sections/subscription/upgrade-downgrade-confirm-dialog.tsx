import { Button } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { SubscriptionData } from 'src/types/stripe';
import {
  createCheckoutSession,
  getSubscriptionDataByPriceId,
  redirectToCheckout,
} from 'src/utils/stripe';
import { calcProrationAmount } from './utils/calc-proration-amount';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onConfirm?: VoidFunction;
  type: 'upgrade' | 'downgrade';
  nextPlan?: SubscriptionData;
};

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export function UpgradeDowngradeConfirmDialog({ open, onClose, onConfirm, type, nextPlan }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { subscription } = useCurrentSubscription();
  const { data: session } = useSession();
  const [prorationValue, setProrationValue] = useState<number>(0);

  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return getSubscriptionDataByPriceId(subscription.price_id);
  }, [subscription]);

  const endSubscriptionDate = useMemo(() => {
    if (!subscription?.current_period_end) return '';
    return format(new Date(subscription.current_period_end), 'MMMMMM do yyyy');
  }, [subscription]);

  // Calculate the proration amount
  useEffect(() => {
    if (type !== 'upgrade') return;
    const getProrationAmount = async () => {
      if (!subscription || !nextPlan?.priceId) return;
      const amount = await calcProrationAmount(subscription?.subscription_id, nextPlan.priceId);
      setProrationValue(amount);
    };

    getProrationAmount();
  }, [subscription, nextPlan, type]);

  const handleSubscribeWithProration = async () => {
    const stripe: Stripe | null = await stripePromise;
    if (!stripe) return;

    try {
      const email = session?.user.email;
      if (!email) throw new Error('Email is required for checkout.');
      const sessionId = await createCheckoutSession(email, undefined, {
        currency: 'usd',
        unit_amount: prorationValue,
        product_data: {
          name: 'name of the product',
        },
      });
      await redirectToCheckout(sessionId);
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    }
  };

  const renderContent = (
    <p>
      {type === 'upgrade'
        ? `You are changing from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan'. You will be charged $${prorationValue} now and then ${nextPlan?.price} starting on ${endSubscriptionDate}. You can cancel at anytime.`
        : `You are changing from the '${currentPlan?.name} Plan' to the '${nextPlan?.name} Plan'. Downgrade will take place at the end of the current billing cycle starting on ${endSubscriptionDate}. You can cancel at anytime.`}
    </p>
  );

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={`Confirm plan ${type}`}
      hideCancelButton
      content={renderContent}
      action={
        <>
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm || handleSubscribeWithProration}
          >
            Yes
          </Button>
        </>
      }
    />
  );
}
