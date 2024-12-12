import { Icon } from '@iconify/react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import { useTransition } from 'react';
import { deleteSender } from 'src/services/db/sender-domains';

function DeleteSender({
  tooltipText,
  id,
  type,
}: {
  tooltipText: string;
  id: string;
  type: 'domain' | 'email';
}) {
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    try {
      startTransition(async () => {
        await deleteSender(id, type);
      });
    } catch (error) {
      throw new Error('Error on archiving. Please contact support');
    }
  };
  return (
    <Tooltip title={`Delete sender ${tooltipText}.`} placement="top-start">
      <IconButton size="medium" onClick={handleDelete} disabled={isPending}>
        <Icon icon="material-symbols:delete" color={theme.palette.error.dark} />
      </IconButton>
    </Tooltip>
  );
}

export default DeleteSender;
