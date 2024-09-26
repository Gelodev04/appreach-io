'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSnackbar } from 'src/components/snackbar';
import { STRIPE } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { createCheckoutSession, redirectToCheckout } from 'src/utils/stripe';
import { CheckoutElement } from '../checkout-element';

// Stripe promise for loading the Stripe object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutView() {
  const router = useRouter();
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
    <Stack justifyContent="center" alignItems="center" textAlign="center" spacing={1}>
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
        onClick={() => router.push(paths.checkout.trial1)}
        title="Starter"
        subtitle="*Price per domain"
        price="$150"
        features={[
          'Works with all email providers to audit and monitor your existing domain.',
          'Inbox placement report for popular ESPs (Microsoft Business, Microsoft Personal, Google Business, Google Personal, Yahoo).',
          'Segment reports by email subject, ip, domain, ESP, mail server, region and monitor inbox health.',
        ]}
      />
      <CheckoutElement
        onClick={() => handleCheckout(STRIPE.prices.established)}
        title="Established"
        subtitle="5 domains included"
        price="$499"
        features={[
          'Everything in the reporting only package plus',
          'Show a large volume of positive engagement to different ESPs from your IP and domain name',
          'Warm up a new IP, repair damaged domain or fix a low sender reputation',
        ]}
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
        height="100%"
        width="100%"
        spacing={4}
        sx={{ padding: 4, margin: '0 auto' }}
      >
        {renderHead}

        {renderOptions}
      </Stack>
    </Container>
  );
}
