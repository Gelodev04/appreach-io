'use client';

import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import { generateLookerStudioUrl } from 'src/sections/host/utils';

export const SharableLookerStudio = ({
  accessToken,
  defaultLookerStudioUrl,
}: {
  accessToken: string;
  defaultLookerStudioUrl?: string;
}) => {
  const [lookerStudioUrl, setLookerStudioUrl] = useState<string>('');
  const lgUp = useResponsive('up', 'lg');

  // Generate Looker Studio URL asynchronously
  useEffect(() => {
    if (accessToken) {
      generateLookerStudioUrl([accessToken], defaultLookerStudioUrl).then(setLookerStudioUrl);
    }
  }, [accessToken, defaultLookerStudioUrl]);

  const renderLookerStudioIframe = (
    <iframe
      src={lookerStudioUrl}
      width="100%"
      title="Looker Studio Dashboard"
      style={{ borderRadius: '10px', border: 'none', height: lgUp ? '100%' : '100vh' }}
    />
  );

  return <Box sx={{ height: '100%' }}>{lookerStudioUrl && renderLookerStudioIframe}</Box>;
};
