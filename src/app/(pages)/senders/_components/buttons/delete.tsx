import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

function DeleteSender({ tooltipText }: { tooltipText: string }) {
  const theme = useTheme();
  return (
    <Tooltip title={`Delete sender ${tooltipText}.`} placement="top-start">
      <IconButton size="medium">
        <Icon icon="material-symbols:delete" color={theme.palette.error.dark} />
      </IconButton>
    </Tooltip>
  );
}

export default DeleteSender;
