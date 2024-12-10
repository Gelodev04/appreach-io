'use client';

import { Alert, Box, Button, Container, Skeleton, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import type { SubscriptionData } from 'src/types/stripe';
import {
  createSubscriptionSession,
  getSubscriptionData,
  redirectToCheckout,
} from 'src/utils/stripe';
import { endpoints } from 'src/utils/swr';
import { env } from 'src/data/env/client';
import { updateSubcription } from 'src/services/stripe/update-subscription';
import { useRouter } from 'next/navigation';
import { UserSettingsPlan } from '@prisma/client';
import { useState } from 'react';
import { CheckoutElement } from '../checkout-element';
import { UpgradeDowngradeConfirmDialogV2 } from '../upgrade-downgrade-confirm-dialog-v2';
// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type SubscriptionviewType = {
  subscription: UserSettingsPlan | null;
};

export default function SubscriptionView({ subscription }: SubscriptionviewType) {
  // Snackbar for notifications
  const { enqueueSnackbar } = useSnackbar();

  // Subscription state management
  const [nextPlan, setNextPlan] = useState<SubscriptionData>();
  const [type, setType] = useState<'downgrade' | 'upgrade'>('upgrade');

  // Session and routing
  const { data: session } = useSession();
  const router = useRouter();

  // Search parameters and trial status
  const searchParams = useSearchParams();
  const trialExpired = searchParams.get('trial_expired');

  // Confirmation dialogs
  const confirmCancel = useBoolean();
  const confirmUpgradeDowngrade = useBoolean();

  const handleSubscribe = async (priceId: string) => {
    const stripe: Stripe | null = await stripePromise;
    if (!stripe) return;

    try {
      const email = session?.user.email;
      if (!email) throw new Error('Email is required for checkout.');
      else {
        const sessionId = await createSubscriptionSession(email, priceId);
        await redirectToCheckout(sessionId);
      }
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    }
  };

  const handleCancel = async () => {
    try {
      const url = endpoints.stripe.cancelSubscription;
      const response = await fetch(url, { method: 'DELETE' });
      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || 'Failed to cancel subscription');

      enqueueSnackbar(responseData?.message || 'Subscription cancelled successfully', {
        variant: 'success',
      });

      // Reload the page to refresh subscription data
      window.location.href = paths.checkout.root;
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      confirmCancel.onFalse();
    }
  };

  const handleUpgradeDowngrade = async () => {
    try {
      if (subscription?.status === 'active' && nextPlan?.priceId) {
        if (!subscription.subscription_id) {
          throw new Error('No subscription Id found');
        }
        const updatedSubscription = await updateSubcription(
          subscription.subscription_id,
          nextPlan.priceId
        );
        if (updatedSubscription) {
          enqueueSnackbar(`Updated the plan successfully`, { variant: 'success' });
          confirmUpgradeDowngrade.setValue(false);
          router.refresh();
        }
      } else {
        enqueueSnackbar(`Unable to ${type}.`, { variant: 'error' });
      }
    } catch (error) {
      console.log(error);
      throw new Error('Unable to downgrade or upgrade', error);
    }
  };

  const handlePlanSelection = (plan: SubscriptionData) => {
    const currentSubcription = getSubmitTitle(plan.key);

    const isCurrentPlan = subscription?.lookup_key === plan.key;
    // Handle upgrade or downgrade confirmation
    if (subscription && !isCurrentPlan) {
      confirmUpgradeDowngrade.setValue(true);
      setType(currentSubcription.toLowerCase() as 'downgrade' | 'upgrade');
      setNextPlan(plan);
      return;
    }

    if (subscription?.status === 'canceled') return handleSubscribe(plan.priceId);

    // Handle current plan actions
    if (isCurrentPlan) return confirmCancel.onTrue();

    // Handle plan switching
    if (subscription) return handleSubscribe(plan.priceId);

    // Default case - upgrade to higher plan
    return handleSubscribe(plan.priceId);
  };

  const getSubmitTitle = (planKey: string) => {
    if (!subscription) return 'Upgrade';

    const isCanceled = subscription?.status === 'canceled';
    if (!isCanceled && planKey === subscription.lookup_key) return 'Cancel plan';

    if (!subscription.price_id) {
      throw new Error('No subscription price id');
    }

    const currentPlanData = getSubscriptionData(subscription.price_id);
    const nextPlanData = Object.values(STRIPE.subscriptions).find((plan) => plan.key === planKey);

    if (currentPlanData && nextPlanData) {
      return nextPlanData.order < currentPlanData.order ? 'Downgrade' : 'Upgrade';
    }

    return 'Upgrade';
  };

  const getSubmitSubtitle = (planKey: string) => {
    const isCurrent = planKey === subscription?.lookup_key;
    if (!isCurrent) return;

    if (subscription?.status === 'canceled') {
      if (!subscription.current_period_end) {
        throw new Error('No subscription current_period_end');
      }

      const formattedEndDate = format(new Date(subscription.current_period_end), 'MMMMMM do');
      return `Plan will cancel on ${formattedEndDate}`;
    }

    return 'This is your current plan';
  };

  const getSubmitVariant = (planKey: string): 'purchase' | 'cancel' => {
    const isCanceled = subscription?.status === 'canceled';
    const isCurrent = subscription?.lookup_key === planKey;

    if (!isCurrent) return 'purchase';
    if (isCurrent && !isCanceled) return 'cancel';
    return 'purchase';
  };

  const renderHead = (
    <Stack justifyContent="center" alignItems="center" textAlign="center" spacing={1}>
      <Logo />
      <Typography variant="h4" color="text.primary">
        Upgrade Or Downgrade Anytime
      </Typography>
    </Stack>
  );

  const renderWarning = (
    <Alert variant="standard" severity="warning" sx={{ mt: 1 }}>
      Your free trial has expired. Select a plan to continue.
    </Alert>
  );

  const renderOptions = (
    <Box display="flex" gap={4}>
      <CheckoutElement
        title="Starter"
        subtitle="100 Seed Accounts"
        onSubmit={() => handlePlanSelection(STRIPE.subscriptions.starter)}
        price={STRIPE.subscriptions.starter.price}
        features={[
          'Send up to 100 emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Includes 1 sender profile',
          'Email and live chat support included',
        ]}
        submitTitle={getSubmitTitle(STRIPE.subscriptions.starter.key)}
        submitSubtitle={getSubmitSubtitle(STRIPE.subscriptions.starter.key)}
        variant={getSubmitVariant(STRIPE.subscriptions.starter.key)}
      />
      <CheckoutElement
        title="Established"
        subtitle="500 Seed Accounts*"
        onSubmit={() => handlePlanSelection(STRIPE.subscriptions.established)}
        price={STRIPE.subscriptions.established.price}
        features={[
          'Send up to 500 emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Includes 5 sender profile',
          'Email and live chat support included',
        ]}
        comment="*Additional senders and seed accounts available. Contact us about your specific use case."
        submitTitle={getSubmitTitle(STRIPE.subscriptions.established.key)}
        submitSubtitle={getSubmitSubtitle(STRIPE.subscriptions.established.key)}
        variant={getSubmitVariant(STRIPE.subscriptions.established.key)}
      />
      <CheckoutElement
        title="Managed Service"
        subtitle="Contact Us"
        features={[
          'Send 500+ emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Think of us as part of your team',
          '1-on-1 zoom calls',
        ]}
        submitTitle="Contact Us"
        variant="neutral"
      />
    </Box>
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ height: '100%' }}>
        {trialExpired && renderWarning}
        <Stack
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="100%"
          width="100%"
          spacing={4}
          sx={{ padding: 4, margin: '0 auto' }}
        >
          {renderHead}
          {renderOptions}
        </Stack>
      </Container>

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={confirmCancel.onFalse}
        title="Confirm cancel"
        hideCancelButton
        content="Are you sure you want to cancel? You will lose access at the end of your billing period"
        action={
          <>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Cancel Plan
            </Button>
            <Button variant="outlined" onClick={confirmCancel.onFalse}>
              Do Not Cancel
            </Button>
          </>
        }
      />

      <UpgradeDowngradeConfirmDialogV2
        open={confirmUpgradeDowngrade.value}
        onClose={confirmUpgradeDowngrade.onFalse}
        nextPlan={nextPlan}
        onConfirm={handleUpgradeDowngrade}
        type={type}
      />
    </>
  );
}
