import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState, useTransition } from 'react';
import Iconify from 'src/components/iconify';
import { updateSenderAccountLabel } from 'src/services/db/sender-accounts';

type EventSendersDropdownProps = {
  params: GridCellParams;
};

export const EventSendersTextbox = ({ params }: EventSendersDropdownProps) => {
  const [senderName, setSenderName] = useState(params.value?.toString() || '');

  const [unsaved, setUnsaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderName(e.target.value);
    setUnsaved(true);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent grid "Select All"
    if (e.ctrlKey && e.key.toLowerCase() === 'a') {
      e.stopPropagation();
    }

    // Prevent grid/page scrolling on Spacebar
    if (e.key === ' ' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.stopPropagation();
    }

    // Prevent Delete key from affecting grid selection
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.stopPropagation();
    }

    // Prevent arrow keys from navigating the grid
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.stopPropagation();
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const response = await updateSenderAccountLabel({
        id: params.row.id,
        sender_name: senderName,
      });

      if (!response.success) {
        enqueueSnackbar(response.message || 'Update failed', { variant: 'error', persist: true });
      } else {
        setUnsaved(false);
        enqueueSnackbar('Sender Name updated', { variant: 'success' });
      }
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={unsaved && 'You have unsaved changes'} placement="top">
        <TextField
          error={unsaved}
          value={senderName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </Tooltip>

      <Tooltip title="Save changes" placement="top">
        <IconButton onClick={handleSave} disabled={isPending || !unsaved}>
          <Iconify icon="material-symbols:save-outline-rounded" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
