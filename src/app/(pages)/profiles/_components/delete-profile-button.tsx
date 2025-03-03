'use client';

import { Icon } from '@iconify/react';
import { Box, Button, IconButton, Tooltip, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteHostFromUser } from 'src/services/db/hosts';

export const DeleteProfileButton = ({ id, name }: { id: string; name: string }) => {
  const confirmDelete = useBoolean();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteHostFromUser(id);
      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
      } else {
        enqueueSnackbar('Update success!');
        confirmDelete.onFalse();
      }
    });
  };

  return (
    <>
      <Tooltip title="Delete email" placement="top">
        <Box sx={{ p: 0.5, position: 'relative' }}>
          <IconButton size="medium" onClick={confirmDelete.onTrue}>
            <Icon icon="material-symbols:delete" color={theme.palette.error.dark} />
          </IconButton>
        </Box>
      </Tooltip>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete profile: <strong> {name} </strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" disabled={isPending} onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
};
