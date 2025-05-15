'use client';

import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Error from 'src/components/error/error';
import { useGetLookerStudioUrl } from 'src/hooks/api/looker-studio';
import { useResponsive } from 'src/hooks/use-responsive';
import { generateLookerStudioUrl } from 'src/sections/host/utils';
import { LookerStudioSkeleton } from 'src/sections/looker-studio/looker-studio-skeleton';

export const SharableLookerStudio = ({ accessToken }: { accessToken: string }) => {
  const { url, urlLoading, urlError, warningMessage } = useGetLookerStudioUrl();
  const lgUp = useResponsive('up', 'lg');

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
      src={generateLookerStudioUrl([accessToken], url)}
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
};
