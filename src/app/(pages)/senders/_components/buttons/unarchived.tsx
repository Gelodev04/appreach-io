import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

export default function Unarchived() {
  const theme = useTheme();
  return (
    <Tooltip title="Unarchive this sender email." placement="top-start">
      <IconButton size="medium">
        <Icon icon="material-symbols:unarchive" color={theme.palette.primary.lighter} />
      </IconButton>
    </Tooltip>
  );
}
