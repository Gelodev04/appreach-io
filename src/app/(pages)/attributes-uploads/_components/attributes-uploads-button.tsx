'use client';

import { Icon } from '@iconify/react';
import { Box, CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { useTransition } from 'react';

export const AttributesUploadsButton = () => {
  const theme = useTheme();

  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    startTransition(async () => {
      console.log('Verifying..');
    });
  };
  return (
    <Tooltip title="Revalidate email" placement="top">
      <Box sx={{ p: 0.5, position: 'relative' }}>
        {isPending && ( // Show progress only when pending
          <CircularProgress
            size={38} // Set size larger than the button
            sx={{
              color: theme.palette.grey[300],
              position: 'absolute',
              zIndex: 1,
            }}
          />
        )}
        <IconButton size="medium" onClick={handleVerify} disabled={isPending}>
          <Icon
            icon="material-symbols:refresh"
            color={isPending ? theme.palette.grey[300] : theme.palette.primary.lighter}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
};
