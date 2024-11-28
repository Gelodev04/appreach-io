'use client';

import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { useCurrentSubscription } from 'src/hooks/api/subscription';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export default function SubscriptionSuccessView() {
  const { subscriptionLoading, subscriptionError } = useCurrentSubscription();

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

      <Alert severity="success" sx={{ textAlign: 'start', width: '100%' }}>
        <AlertTitle>Thank you for your purchase</AlertTitle>
        If your new plan does not take affect in the next 2 minutes, please contact support via
        chat.
      </Alert>

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
