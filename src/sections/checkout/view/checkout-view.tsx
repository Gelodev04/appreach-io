'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { createCheckoutSession, redirectToCheckout } from 'src/utils/stripe';
import { CheckoutElement } from '../checkout-element';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckout = async (priceId: string) => {
    setLoading(true);

    const stripe: Stripe | null = await stripePromise;

    if (!stripe) {
      setError('Stripe.js failed to load.');
      setLoading(false);
      return;
    }

    try {
      const sessionId = await createCheckoutSession(priceId, 'customer@example.com');
      await redirectToCheckout(sessionId);
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderHead = (
    <Stack justifyContent="center" alignItems="center" textAlign="center" spacing={2} mb={4}>
      <Stack direction="row" display="inline-block" spacing={2}>
        <Typography variant="h2" fontWeight={600}>
          Outreach Magic
          <Box display="inline-flex" ml={2}>
            <Typography variant="h2" fontWeight={600} color="primary">
              Pricing Plans
            </Typography>
          </Box>
        </Typography>
      </Stack>

      <Typography maxWidth="sm" variant="body1" color="text.secondary" fontWeight={700}>
        Outreach Magic Pricing plans are transparent and all-inclusive focused on email
        deliverability first. Contact us if you have any questions.
      </Typography>
    </Stack>
  );

  const renderOptions = (
    <Box display="flex" gap={4}>
      <CheckoutElement
        title="Starter"
        price="$150"
        onClick={() => handleCheckout(STRIPE.prices.starter)}
      />
      <CheckoutElement
        title="Established"
        price="$499"
        onClick={() => handleCheckout(STRIPE.prices.established)}
      />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ height: '100vh' }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        width="100%"
        sx={{ padding: 4, margin: '0 auto' }}
      >
        {renderHead}

        {renderOptions}
      </Stack>
    </Container>
  );
}
