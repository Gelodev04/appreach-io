'use client';

import { Box, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { createCheckoutSession, redirectToCheckout } from 'src/utils/stripe';
import { CheckoutElement } from '../checkout-element';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutView() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckout = async (priceId: string) => {
    const stripe: Stripe | null = await stripePromise;

    if (!stripe) {
      setError('Stripe.js failed to load.');
      return;
    }

    try {
      const email = session?.user.email;
      if (!email) throw new Error('Email is required for checkout.');
      const sessionId = await createCheckoutSession(priceId, email);
      await redirectToCheckout(sessionId);
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    }
  };

  const renderOptions = (
    <>
      <Typography variant="h3" mb={4}>
        Choose your plan
      </Typography>

      <Box display="flex" gap={4}>
        <CheckoutElement
          title="Starter"
          price="$150/month"
          onClick={() => handleCheckout(STRIPE.prices.starter)}
        />
        <CheckoutElement
          title="Established"
          price="$499/month"
          onClick={() => handleCheckout(STRIPE.prices.established)}
        />
      </Box>
    </>
  );

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ padding: 4, maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}
    >
      {renderOptions}
    </Stack>
  );
}
