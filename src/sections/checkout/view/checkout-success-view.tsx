'use client';

import { Button, Stack, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/swr';

export default function CheckoutSuccessView() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') as string;
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!session?.user.email) throw new Error('User email not found.');

        const url = endpoints.stripe.subscriptions;
        const body = JSON.stringify({ email: session.user.email });

        const response = await fetch(url, { method: 'POST', body });
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData?.error || 'Failed to fetch subscription details.');
        }

        setSubscription(responseData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) fetchSubscription();
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
        Thank you for your purchase!
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
        Session ID: {sessionId}
      </Typography>
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
