'use client';

import { Box, Container, Skeleton, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { createCheckoutSession, redirectToCheckout } from 'src/utils/stripe';
import { CheckoutElement } from '../checkout-element';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function SubscriptionView() {
  const { currentPlan, subscriptionLoading } = useCurrentSubscription();
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();

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
        onClick={() => handleCheckout(STRIPE.subscriptions.starter.price)}
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
        onClick={() => handleCheckout(STRIPE.subscriptions.established.price)}
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
        onClick={() => {}}
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
    <Container maxWidth="lg" sx={{ height: '100vh' }}>
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
  );
}
