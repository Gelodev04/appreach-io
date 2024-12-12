import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
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
      <IconButton size="medium" onClick={handleUnArchive} disabled={isPending}>
        <Icon icon="material-symbols:unarchive" color={theme.palette.primary.lighter} />
      </IconButton>
    </Tooltip>
  );
}
