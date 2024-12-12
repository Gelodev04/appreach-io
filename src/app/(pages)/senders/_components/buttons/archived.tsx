import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
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
      <IconButton size="medium" onClick={handleArchive} disabled={isPending}>
        <Icon icon="material-symbols:archive" color={theme.palette.primary.lighter} />
      </IconButton>
    </Tooltip>
  );
}
