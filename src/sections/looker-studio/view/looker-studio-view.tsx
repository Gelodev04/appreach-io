'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import { useGetHosts } from 'src/hooks/api/host';
import { useGetLookerStudioUrl } from 'src/hooks/api/looker-studio';

import Error from 'src/components/error/error';
import { LookerStudioSkeleton } from '../looker-studio-skeleton';

export default function LookerStudioView() {
  const { url, urlLoading, urlError } = useGetLookerStudioUrl();
  const { hosts, hostsLoading } = useGetHosts();
  const [mappedHosts, setMappedHosts] = useState<string[]>([]);

  // Use useEffect to map hosts and set hostCrypt into mappedHosts
  useEffect(() => {
    if (hosts && hosts.length > 0) {
      const mapped: string[] = hosts.map(host => host.hostCrypt);
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
      src={`https://lookerstudio.google.com/embed/u/0/reporting/f5edec0e-e43b-444a-a04c-680c2bc37a2d/page/p_cu8qbu84cd?params=%7B%22hc%22:%22${mappedHosts}%22%7D`}
      width="100%"
      height="100%"
      title="Looker Studio Dashboard"
      style={{ borderRadius: '10px', border: 'none' }}
    />
  );

  return (
    <Box
      sx={{
        height: '90vh',
      }}
    >
      {urlLoading && renderSkeleton}

      {urlError && renderError}

      {url && renderLookerStudioIframe}
    </Box>
  );
}
