'use client';

import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Error from 'src/components/error/error';
import { useGetLookerStudioUrl } from 'src/hooks/api/looker-studio';
import { useResponsive } from 'src/hooks/use-responsive';
import { generateLookerStudioUrl } from 'src/sections/host/utils';
import { LookerStudioSkeleton } from 'src/sections/looker-studio/looker-studio-skeleton';

export const SharableLookerStudio = ({
  accessToken,
  defaultLookerStudioUrl,
}: {
  accessToken: string;
  defaultLookerStudioUrl?: string;
}) => {
  const { url, urlLoading, urlError, warningMessage } = useGetLookerStudioUrl();
  const [lookerStudioUrl, setLookerStudioUrl] = useState<string>('');
  const lgUp = useResponsive('up', 'lg');

  // Generate Looker Studio URL asynchronously
  useEffect(() => {
    if (accessToken) {
      generateLookerStudioUrl([accessToken], defaultLookerStudioUrl).then(setLookerStudioUrl);
    }
  }, [accessToken, defaultLookerStudioUrl]);

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
      src={lookerStudioUrl}
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
      {lookerStudioUrl && renderLookerStudioIframe}
    </Box>
  );
};
