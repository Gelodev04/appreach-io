'use client';

import { Box, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { endpoints } from 'src/utils/swr';
import { CheckoutElement } from '../checkout-element';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleCheckout = async (priceId: string) => {
    setLoading(true);
    setError(null);

    const stripe: Stripe | null = await stripePromise;

    if (!stripe) {
      setError('Stripe.js failed to load.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(endpoints.stripe.checkoutSession, {
        method: 'POST',
        body: JSON.stringify({
          priceId,
          customerEmail: 'customer@example.com', // Replace with dynamic email
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.sessionId) throw new Error('Failed to create Stripe session.');

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (result.error) throw new Error(result.error.message || 'An error occurred');
    } catch (err) {
      enqueueSnackbar(err.message || 'An error occurred', { variant: 'error' });
    } finally {
      setLoading(false);
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
          onClick={() => handleCheckout('price_1YourStarterPriceId')}
        />
        <CheckoutElement
          title="Established"
          price="$499/month"
          onClick={() => handleCheckout('price_1YourEstablishedPriceId')}
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
