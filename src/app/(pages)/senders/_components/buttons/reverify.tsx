import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import React, { useTransition } from 'react';

export default function Reverify({
  tooltipText,
  id,
  type,
}: {
  tooltipText: string;
  id: string;
  type: 'email' | 'domain';
}) {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const handleVerify = () => {
    /* TODO: 
      1. update sender domain or email to status ready
      2. sendSenderVerification with param type if domain or email --> no need to update
      3. Show pop up
    */
  };
  return (
    <Tooltip title="Resend verification email." placement="top-start">
      <IconButton size="medium">
        <Icon icon="material-symbols:refresh" color={theme.palette.primary.lighter} />
      </IconButton>
    </Tooltip>
  );
}
