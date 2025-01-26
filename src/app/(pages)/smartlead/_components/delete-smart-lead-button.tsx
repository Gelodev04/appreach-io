'use client';

import { Icon } from '@iconify/react';
import { Box, Button, IconButton, Tooltip, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteSmartleadById } from 'src/services/db/smartlead';

export const DeleteSmartLeadButton = ({ id }: { id: string }) => {
  const confirmDelete = useBoolean();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteSmartleadById(id);
      if (res?.error) {
        enqueueSnackbar(res.error, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Item deleted successfully', {
          variant: 'success',
        });
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
            Are you sure want to delete email: <strong> email </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            disabled={isPending}
            onClick={() => {
              handleDelete();
              confirmDelete.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
};
