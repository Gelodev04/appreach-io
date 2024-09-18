'use client';

import { Button, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export default function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') as string;

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ padding: 4, maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
    >
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
    </Stack>
  );
}
