'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { m } from 'framer-motion';
import { signOut } from 'next-auth/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Stack from '@mui/material/Stack';

import { LoadingScreen } from '../../../components/loading-screen';
import { MotionContainer, varBounce } from '../../../components/animate';

const handleLogout = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export default function Page() {
  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <Stack
      sx={{
        py: 12,
        m: 'auto',
        maxWidth: 400,
        minHeight: '100vh',
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Box>
            <Image src="/assets/illustrations/auth/login.png" alt="404" width={320} height={320} />
            <LoadingScreen />
          </Box>
        </m.div>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Logging out...
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            You are being logged out of your account. This may take a few seconds. Hope to see you
            again soon!
          </Typography>
        </m.div>
      </MotionContainer>
    </Stack>
  );
}
