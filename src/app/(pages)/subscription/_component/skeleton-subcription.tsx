'use client';

import { Box, Container, Skeleton, Stack, Typography } from '@mui/material';
import Logo from 'src/components/logo';

function SkeletonSubscription() {
  const renderSkeleton = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        flexWrap: 'wrap',
      }}
    >
      <Skeleton sx={{ minWidth: 320, minHeight: 480 }} />
      <Skeleton sx={{ minWidth: 320, minHeight: 480 }} />
      <Skeleton sx={{ minWidth: 320, minHeight: 480 }} />
    </Box>
  );
  const renderHead = (
    <Stack justifyContent="center" alignItems="center" textAlign="center" spacing={1}>
      <Logo />
      <Typography variant="h4" color="text.primary">
        Upgrade Or Downgrade Anytime
      </Typography>
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ height: '100%' }}>
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
        {renderSkeleton}
      </Stack>
    </Container>
  );
}

export default SkeletonSubscription;
