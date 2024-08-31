'use client';

import Image from 'next/image';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MotionContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <m.div variants={varBounce().in}>
        <Box>
          <Image src="/assets/illustrations/errors/404.png" alt="404" width={320} height={320} />
        </Box>
      </m.div>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Oops, unexpected error!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>{error.message}</Typography>
      </m.div>

      <Button onClick={reset} size="large" variant="contained">
        Retry
      </Button>
    </MotionContainer>
  );
}
