import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useState, useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { updateMultipleSenderName } from 'src/services/db/sender-accounts';

export const BulkEditSenderName = ({
  selectedRowIds,
}: {
  selectedRowIds: GridRowSelectionModel;
}) => {
  const [isSenderNameUpdating, startSenderNameUpdate] = useTransition();
  const [senderName, setSenderName] = useState('');
  const [error, setError] = useState('');

  const senderNamePopover = usePopover();
  const confirmEditSenderName = useBoolean();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenderName(e.target.value);
    if (e.target.value.trim() !== '') {
      setError('');
    }
  };

  const handleOpenConfirm = () => {
    if (senderName.trim() === '') {
      setError('Sender name is required');
      return;
    }
    confirmEditSenderName.onTrue();
  };

  const handleSaveSenderName = () => {
    startSenderNameUpdate(async () => {
      const response = await updateMultipleSenderName(selectedRowIds as string[], senderName);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Sender Name update success!');
        senderNamePopover.onClose();
        confirmEditSenderName.onFalse();
        setSenderName('');
        setError('');
      }
    });
  };

  return (
    <>
      <Button
        size="medium"
        color="primary"
        disabled={isSenderNameUpdating}
        onClick={senderNamePopover.onOpen}
        startIcon={<Iconify icon="flowbite:edit-outline" />}
      >
        Edit Sender Name [{selectedRowIds.length}]
      </Button>

      <CustomPopover arrow="top-center" open={senderNamePopover.open} sx={{ width: 500, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Edit Sender Name
            </Typography>
            <IconButton onClick={senderNamePopover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="subtitle2" color={error ? 'error' : 'GrayText'}>
              Sender name
            </Typography>

            <TextField
              value={senderName}
              onChange={handleChange}
              error={Boolean(error)}
              helperText={error}
            />

            <Button
              color="primary"
              variant="contained"
              disabled={isSenderNameUpdating}
              onClick={handleOpenConfirm}
            >
              Save changes
            </Button>
          </Box>
        </Box>
      </CustomPopover>

      <ConfirmDialog
        open={confirmEditSenderName.value}
        onClose={confirmEditSenderName.onFalse}
        title="Update Sender Name"
        content={
          <>
            You are about to update the <b>Sender Name</b> to <b>Test</b> for{' '}
            <b>{selectedRowIds.length} account/s</b>.
          </>
        }
        action={
          <Button
            variant="contained"
            color="primary"
            disabled={isSenderNameUpdating}
            onClick={handleSaveSenderName}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
};
