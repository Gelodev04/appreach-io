'use client';

import { Icon } from '@iconify/react';
import { Box, CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { useTransition } from 'react';

export const DeleteSmartLeadButton = () => {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    try {
      startTransition(async () => {
        console.log('Verifying..');
      });
    } catch (error) {
      throw new Error('Error on archiving. Please contact support');
    }
  };

  return (
    <Tooltip title="Delete email" placement="top">
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
        <IconButton size="medium" onClick={handleDelete} disabled={isPending}>
          <Icon
            icon="material-symbols:delete"
            color={isPending ? theme.palette.grey[300] : theme.palette.error.dark}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
};
