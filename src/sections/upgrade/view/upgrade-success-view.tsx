'use client';

import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { type StripeSubscription } from 'src/types/stripe';
import { fetchUserSubscription, getSubscriptionData } from 'src/utils/stripe';

export default function CheckoutSuccessView() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') as string;
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<StripeSubscription | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!session?.user.email) throw new Error('User email not found.');
        if (!sessionId) throw new Error('No session found.');
        setIsLoading(true);
        const response = await fetchUserSubscription(session.user.email);
        setSubscription(response);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [session?.user.email, sessionId]);

  if (isLoading) return <LoadingScreen />;

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
          Your current plan is the{' '}
          <strong>{getSubscriptionData(subscription.plan.product)?.name}</strong> plan.
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
      <Typography>{error}</Typography>
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
      {error ? renderError : renderSuccess}
    </Stack>
  );
}
