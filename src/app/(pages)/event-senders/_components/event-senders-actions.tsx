'use client';

import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Box, Button, CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState, useTransition } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteSenderAccountById } from 'src/services/db/sender-accounts';
import {
  getWebhookLogBySenderAccount,
  reprocessSendersWebhook,
} from 'src/services/db/webhook-logs';
import { useEventSendersStore } from 'src/store/event-senders';

export const EventSendersActions = ({ id, username }: { id: string; username: string }) => {
  const confirmDelete = useBoolean();
  const confirmProcess = useBoolean();
  const theme = useTheme();
  const [isPending, startTransition] = useTransition();
  const [isReprocessing, startReprocess] = useTransition();
  const [events, setEvents] = useState(0);
  const [data, setData] = useState<Record<string, any>>({});

  const { isProcessing, setIsProcessing } = useEventSendersStore();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteSenderAccountById(id);
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
    setData({});
    setIsProcessing(true);
    startTransition(async () => {
      const res = await getWebhookLogBySenderAccount(username);

      if (!res.success) {
        enqueueSnackbar(res.message, {
          variant: 'error',
        });
        setIsProcessing(false);
        return;
      } else {
        if (res.data?.length === 0) {
          enqueueSnackbar('No events to reprocess', {
            variant: 'info',
          });
          setIsProcessing(false);
          return;
        } else {
          setEvents(res.data?.length || 0);
          confirmProcess.onTrue();
          setIsProcessing(false);
        }
      }
    });
  };

  const handleReprocessConfirm = () => {
    startReprocess(async () => {
      const res = await reprocessSendersWebhook(username);

      if (!res.success) {
        enqueueSnackbar(res.message, {
          variant: 'error',
        });
        return;
      } else {
        setData(res.data);
      }
    });
  };

  return (
    <>
      <Tooltip title="Reprocess all" placement="top">
        <IconButton disabled={isProcessing} size="medium" onClick={handleReprocess}>
          {isPending && (
            <CircularProgress
              size={38}
              sx={{
                color: theme.palette.grey[300],
                position: 'absolute',
                zIndex: 1,
              }}
            />
          )}
          <Icon
            icon="material-symbols:refresh"
            style={{ pointerEvents: 'none' }}
            color={isProcessing ? theme.palette.grey[300] : theme.palette.primary.lighter}
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

      <ConfirmDialog
        open={confirmProcess.value}
        onClose={confirmProcess.onFalse}
        isLoading={isReprocessing}
        title="Reprocess"
        content={
          <>
            <b>{username}</b> has <b>{events}</b> events. Continue with reprocessing them all?
            {Object.keys(data).length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
                <Label variant="soft" color="success">
                  {data?.success} events successfully reprocessed.
                </Label>
                <Label variant="soft" color="warning">
                  {data?.skipped} events skipped.
                </Label>
                <Label variant="soft" color="error">
                  {data?.error} errors occured.
                </Label>
              </Box>
            )}
          </>
        }
        action={
          <LoadingButton
            loading={isReprocessing}
            variant="contained"
            color="primary"
            onClick={() => {
              handleReprocessConfirm();
            }}
          >
            Confirm
          </LoadingButton>
        }
      />
    </>
  );
};
