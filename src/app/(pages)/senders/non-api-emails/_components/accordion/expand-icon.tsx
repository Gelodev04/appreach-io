import { Icon } from '@iconify/react';
import { Box, IconButton, useTheme } from '@mui/material';
import React from 'react';

export default function ExpandIcon({
  isVerified,
  onClick,
}: {
  isVerified: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const theme = useTheme();
  return (
    <IconButton onClick={onClick}>
      {isVerified ? (
        <Box sx={{ width: 24 }} />
      ) : (
        <Icon icon="material-symbols:keyboard-arrow-down" color={theme.palette.primary.main} />
      )}
    </IconButton>
  );
}
