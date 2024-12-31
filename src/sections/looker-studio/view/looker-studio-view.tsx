'use client';

import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Error from 'src/components/error/error';
import { useGetHosts } from 'src/hooks/api/host';
import { useGetLookerStudioUrl } from 'src/hooks/api/looker-studio';
import { useResponsive } from 'src/hooks/use-responsive';
import { generateLookerStudioUrl } from 'src/sections/host/utils';
import { Alert } from '@mui/material';
import { useIsTrialExpired } from 'src/hooks/use-is-trial-expired';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { LookerStudioSkeleton } from '../looker-studio-skeleton';

export default function LookerStudioView() {
  const { url, urlLoading, urlError, warningMessage } = useGetLookerStudioUrl();
  const { hosts } = useGetHosts();
  const [mappedHosts, setMappedHosts] = useState<string[]>([]);
  const lgUp = useResponsive('up', 'lg');
  const router = useRouter();
  const isTrialExpired = useIsTrialExpired();

  // Use useEffect to map hosts and set hostCrypt into mappedHosts
  useEffect(() => {
    if (hosts && hosts.length > 0) {
      const mapped: string[] = hosts.map((host) => host.hostCrypt);
      setMappedHosts(mapped);
    }
  }, [hosts]);

  if (isTrialExpired) {
    router.push(paths.checkout.root);
  }

  const renderSkeleton = <LookerStudioSkeleton />;

  const renderError = (
    <Error
      filled
      title={`${urlError?.status}`}
      description={`${urlError?.message}`}
      sx={{ py: 10 }}
    />
  );

  const renderWarning = (
    <Alert variant="standard" severity="warning" sx={{ mt: 1, mb: 2 }}>
      {warningMessage}
    </Alert>
  );

  const renderLookerStudioIframe = (
    <iframe
      src={generateLookerStudioUrl(mappedHosts, url)}
      width="100%"
      title="Looker Studio Dashboard"
      style={{ borderRadius: '10px', border: 'none', height: lgUp ? '100%' : '100vh' }}
    />
  );

  return (
    <Box sx={{ height: '100%' }}>
      {warningMessage && renderWarning}
      {urlLoading && renderSkeleton}
      {urlError && renderError}
      {url && renderLookerStudioIframe}
    </Box>
  );
}
