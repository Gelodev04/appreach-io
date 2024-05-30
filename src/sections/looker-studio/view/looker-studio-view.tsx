'use client';

import Box from '@mui/material/Box';

import { useGetLookerStudioUrl } from 'src/hooks/api/looker-studio';

import Error from 'src/components/error/error';

import { LookerStudioSkeleton } from '../looker-studio-skeleton';

export default function LookerStudioView() {
  const { url, urlLoading, urlError } = useGetLookerStudioUrl();

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
      src={url}
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
