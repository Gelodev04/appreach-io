'use client';

import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Error from 'src/components/error/error';
import { useGetHosts } from 'src/hooks/api/host';
import { useGetLookerStudioUrl } from 'src/hooks/api/looker-studio';
import { generateLookerStudioUrl } from 'src/sections/host/utils';
import { LookerStudioSkeleton } from '../looker-studio-skeleton';

export default function LookerStudioView() {
  const { url, urlLoading, urlError } = useGetLookerStudioUrl();
  const { hosts } = useGetHosts();
  const [mappedHosts, setMappedHosts] = useState<string[]>([]);

  // Use useEffect to map hosts and set hostCrypt into mappedHosts
  useEffect(() => {
    if (hosts && hosts.length > 0) {
      const mapped: string[] = hosts.map((host) => host.hostCrypt);
      setMappedHosts(mapped);
    }
  }, [hosts]);

  const renderSkeleton = <LookerStudioSkeleton />;

  const renderError = (
    <Error
      filled
      title={`${urlError?.status}`}
      description={`${urlError?.message}`}
      sx={{ py: 10 }}
    />
  );

  const renderLookerStudioIframe = (
    <iframe
      // src={url}
      src={generateLookerStudioUrl(mappedHosts)}
      width="100%"
      height="100%"
      title="Looker Studio Dashboard"
      style={{ borderRadius: '10px', border: 'none' }}
    />
  );

  return (
    <Box sx={{ height: '100%' }}>
      {urlLoading && renderSkeleton}
      {urlError && renderError}
      {url && renderLookerStudioIframe}
    </Box>
  );
}
