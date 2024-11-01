'use client';

import { Box, Button, Container, Skeleton, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { SubscriptionData } from 'src/types/stripe';
import {
  createCheckoutSession,
  getSubscriptionDataByPriceId,
  redirectToCheckout,
} from 'src/utils/stripe';
import { endpoints } from 'src/utils/swr';
import { CheckoutElement } from '../checkout-element';
import { UpgradeDowngradeConfirmDialog } from '../upgrade-downgrade-confirm-dialog';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function SubscriptionView() {
  const { enqueueSnackbar } = useSnackbar();
  const { currentPlan, subscriptionLoading } = useCurrentSubscription();
  const { data: session } = useSession();
  const confirmCancel = useBoolean();
  const confirmSubscription = useBoolean();
  const [nextPlan, setNextPlan] = useState<SubscriptionData | undefined>();

  const handleCheckout = async (priceId: string) => {
    const stripe: Stripe | null = await stripePromise;
    if (!stripe) return;

    try {
      const email = session?.user.email;
      if (!email) throw new Error('Email is required for checkout.');
      const sessionId = await createCheckoutSession(priceId, email);
      await redirectToCheckout(sessionId);
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    }
  };

  // Check if there's an existing subscription
  const handleSubscribe = (priceId: string) => {
    if (currentPlan) {
      const nextSubscriptionData = getSubscriptionDataByPriceId(priceId);
      if (nextSubscriptionData) setNextPlan(nextSubscriptionData);
      confirmSubscription.onTrue();
    } else {
      handleCheckout(priceId);
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

  const getNextActionType = () => {
    if (!currentPlan) return 'upgrade';
    if (currentPlan.product === STRIPE.subscriptions.starter.product) return 'upgrade';
    return 'downgrade';
  };

  const getStarterLabel = () => {
    if (!currentPlan) return 'Upgrade';
    if (currentPlan.product === STRIPE.subscriptions.starter.product) return 'Cancel plan';
    if (currentPlan.product === STRIPE.subscriptions.established.product) return 'Downgrade';

    return 'Upgrade';
  };

  const renderHead = (
    <Stack justifyContent="center" alignItems="center" textAlign="center" spacing={1}>
      <Logo />
      <Typography variant="h4" color="text.primary">
        Upgrade Or Downgrade Anytime
      </Typography>
    </Stack>
  );

  const renderOptions = (
    <Box display="flex" gap={4}>
      <CheckoutElement
        title="Starter"
        subtitle="100 Seed Accounts"
        onCancel={confirmCancel.onTrue}
        onPurchase={() => handleSubscribe(STRIPE.subscriptions.starter.priceId)}
        price={STRIPE.subscriptions.starter.price}
        features={[
          'Send up to 100 emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Includes 1 sender profile',
          'Email and live chat support included',
        ]}
        isCurrentPlan={currentPlan?.product === STRIPE.subscriptions.starter.product}
        SubmitProps={{
          children: getStarterLabel(),
        }}
      />
      <CheckoutElement
        title="Established"
        subtitle="500 Seed Accounts*"
        onCancel={confirmCancel.onTrue}
        onPurchase={() => handleSubscribe(STRIPE.subscriptions.established.priceId)}
        price={STRIPE.subscriptions.established.price}
        features={[
          'Send up to 500 emails daily to our seed list',
          'Inbox Daddy unique reporting to identify what elements are hurting your deliverability​',
          'Includes 5 sender profile',
          'Email and live chat support included',
        ]}
        comment="*Additional senders and seed accounts available. Contact us about your specific use case."
        isCurrentPlan={currentPlan?.product === STRIPE.subscriptions.established.product}
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
        SubmitProps={{
          children: 'Contact Us',
          variant: 'outlined',
          color: 'inherit',
        }}
      />
    </Box>
  );

  const renderSkeleton = (
    <Box display="flex" gap={4}>
      <Skeleton sx={{ minWidth: 320, minHeight: 480, height: '100%' }} />
      <Skeleton sx={{ minWidth: 320, minHeight: 480, height: '100%' }} />
      <Skeleton sx={{ minWidth: 320, minHeight: 480, height: '100%' }} />
    </Box>
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ height: '100%' }}>
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
          {subscriptionLoading ? renderSkeleton : renderOptions}
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

      <UpgradeDowngradeConfirmDialog
        open={confirmSubscription.value}
        onClose={confirmSubscription.onFalse}
        onConfirm={() => nextPlan && handleCheckout(nextPlan.priceId)}
        currentPlan={currentPlan}
        nextPlan={nextPlan}
        type={getNextActionType()}
      />
    </>
  );
}
