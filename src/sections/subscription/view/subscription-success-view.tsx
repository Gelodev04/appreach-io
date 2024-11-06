'use client';

import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { getSubscriptionDataByPriceId } from 'src/utils/stripe';

export default function SubscriptionSuccessView() {
  const { subscription, subscriptionLoading, subscriptionError } = useCurrentSubscription();
  const currentPlan = useMemo(() => {
    if (!subscription) return undefined;
    return getSubscriptionDataByPriceId(subscription?.price_id);
  }, [subscription]);

  if (subscriptionLoading) return <LoadingScreen />;

  const renderSuccess = (
    <>
      <Image
        src="/assets/illustrations/seeds/person.png"
        alt="seeds"
        width={250}
        height={250}
        priority
        quality={100}
      />
      <Typography variant="h3" sx={{ mb: 0.5 }}>
        Payment succeeded!
      </Typography>

      {subscription && (
        <Alert severity="success" sx={{ textAlign: 'start', width: '100%' }}>
          <AlertTitle>Thank you for your purchase</AlertTitle>
          Your current plan is the <strong>{currentPlan?.name}</strong> plan.
        </Alert>
      )}
      <Button
        component={RouterLink}
        href={paths.dashboard.root}
        variant="contained"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        sx={{ mt: 3 }}
      >
        Back to Dashboard
      </Button>
    </>
  );

  const renderError = (
    <>
      <Image
        src="/assets/illustrations/errors/404.png"
        alt="seeds"
        width={250}
        height={250}
        priority
        quality={100}
      />
      <Typography variant="h3">Error</Typography>
      <Typography>{subscriptionError}</Typography>
    </>
  );

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      sx={{ padding: 4, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
    >
      {subscriptionError ? renderError : renderSuccess}
    </Stack>
  );
}
