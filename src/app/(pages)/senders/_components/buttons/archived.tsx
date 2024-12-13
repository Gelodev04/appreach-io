import { Icon } from '@iconify/react';
import { Box, CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { useTransition } from 'react';
import { archiveSenderEmail } from 'src/services/db/sender-addresses';

export default function Archive({ id }: { id: string }) {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const handleArchive = () => {
    try {
      startTransition(async () => {
        await archiveSenderEmail(id);
      });
    } catch (error) {
      throw new Error('Error on archiving. Please contact support');
    }
  };
  return (
    <Tooltip title="Archive this sender email." placement="top-start">
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
        <IconButton size="medium" onClick={handleArchive} disabled={isPending}>
          <Icon
            icon="material-symbols:archive"
            color={isPending ? theme.palette.grey[300] : theme.palette.primary.lighter}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
}
