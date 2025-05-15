'use client';

import { m } from 'framer-motion';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import CompactLayout from 'src/layouts/compact';

import { MotionContainer, varBounce } from 'src/components/animate';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Box>
            <Image src="/assets/illustrations/errors/404.png" alt="404" width={320} height={320} />
          </Box>
        </m.div>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Sorry, Page Not Found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            Sorry, we couldn’t find the page you’re looking for.
          </Typography>
        </m.div>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button component={RouterLink} href="/" size="large" variant="contained">
            Go to App
          </Button>
          <Button
            component={RouterLink}
            color="primary"
            href={paths.website.root}
            size="large"
            variant="contained"
          >
            Go to Home
          </Button>
        </Box>
      </MotionContainer>
    </CompactLayout>
  );
}
