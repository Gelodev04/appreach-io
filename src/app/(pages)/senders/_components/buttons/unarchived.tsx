import { Icon } from '@iconify/react';
import { Box, CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { useTransition } from 'react';
import { unArchiveSenderEmail } from 'src/services/db/sender-addresses';

export default function Unarchived({ id }: { id: string }) {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const handleUnArchive = () => {
    try {
      startTransition(async () => {
        await unArchiveSenderEmail(id);
      });
    } catch (error) {
      throw new Error('Error on archiving. Please contact support');
    }
  };
  return (
    <Tooltip title="Unarchive this sender email." placement="top-start">
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
        <IconButton size="medium" disabled={isPending} onClick={handleUnArchive}>
          <Icon
            icon="material-symbols:unarchive"
            color={isPending ? theme.palette.grey[300] : theme.palette.primary.lighter}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
}
