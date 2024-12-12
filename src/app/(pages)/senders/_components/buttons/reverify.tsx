import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import React from 'react';

export default function Reverify({ tooltipText }: { tooltipText: string }) {
  const theme = useTheme();
  return (
    <Tooltip title="Resend verification email." placement="top-start">
      <IconButton size="medium">
        <Icon icon="material-symbols:refresh" color={theme.palette.primary.lighter} />
      </IconButton>
    </Tooltip>
  );
}
