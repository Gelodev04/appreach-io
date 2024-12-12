import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

export default function Archive() {
  const theme = useTheme();
  return (
    <Tooltip title="Archive this sender email." placement="top-start">
      <IconButton size="medium">
        <Icon icon="material-symbols:archive" color={theme.palette.primary.lighter} />
      </IconButton>
    </Tooltip>
  );
}
