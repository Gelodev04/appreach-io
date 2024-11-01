'use client';

import { Alert, Box, Button, Container, Skeleton, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { createCheckoutSession, redirectToCheckout } from 'src/utils/stripe';
import { useSearchParams } from 'src/routes/hooks';
import { endpoints } from 'src/utils/swr';
import { CheckoutElement } from '../checkout-element';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function SubscriptionView() {
  const { enqueueSnackbar } = useSnackbar();
  const { currentPlan, subscriptionLoading } = useCurrentSubscription();
  const { data: session } = useSession();
  const confirmCancel = useBoolean();

  const searchParams = useSearchParams();
  const trialExpired = searchParams.get('trial_expired');

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
        onCancel={confirmCancel.onTrue}
        onPurchase={() => handleCheckout(STRIPE.subscriptions.starter.price)}
        price="$150"
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
        onPurchase={() => handleCheckout(STRIPE.subscriptions.established.price)}
        price="$650"
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
      <Container maxWidth="lg" sx={{ height: '100vh' }}>
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
    </>
  );
}
