'use client';

import { Icon } from '@iconify/react';
import { Button, IconButton, Tooltip, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteSenderAccountById } from 'src/services/db/sender-accounts';

export const SenderAccountsActions = ({
  id,
  username,
  path,
}: {
  id: string;
  username: string;
  path: string;
}) => {
  const confirmDelete = useBoolean();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteSenderAccountById(id, path);
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

  const handleReprocess = () => {
    startTransition(async () => {
      enqueueSnackbar('Item reprocessed!', {
        variant: 'success',
      });
    });
  };

  return (
    <>
      <Tooltip title="Reprocess all" placement="top">
        <IconButton size="medium" onClick={handleReprocess}>
          <Icon
            icon="material-symbols:refresh"
            style={{ pointerEvents: 'none' }}
            color={isPending ? theme.palette.grey[300] : theme.palette.primary.lighter}
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete LinkedIn User" placement="top">
        <IconButton size="medium" onClick={confirmDelete.onTrue}>
          <Icon
            style={{ pointerEvents: 'none' }}
            icon="material-symbols:delete"
            color={theme.palette.error.dark}
          />
        </IconButton>
      </Tooltip>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete user: <strong> {username} </strong>?
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
