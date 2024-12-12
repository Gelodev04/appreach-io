import { Icon } from '@iconify/react';
import { Box, IconButton, useTheme } from '@mui/material';
import React from 'react';

export default function ExpandIcon({ isVerified }: { isVerified: boolean }) {
  const theme = useTheme();
  return (
    <IconButton>
      {isVerified ? (
        <Box sx={{ width: 24 }} />
      ) : (
        <Icon icon="material-symbols:keyboard-arrow-down" color={theme.palette.primary.main} />
      )}
    </IconButton>
  );
}
