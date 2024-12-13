import { Icon, IconifyIcon } from '@iconify/react';
import { Box, Typography } from '@mui/material';

export default function TabTitle({ icon, title }: { icon: string | IconifyIcon; title: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon icon={icon} width={22} />
      <Typography>{title}</Typography>
    </Box>
  );
}
