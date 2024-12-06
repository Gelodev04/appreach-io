import { LoadingButton } from '@mui/lab';
import { Stack, Tooltip, Typography } from '@mui/material';
import React, { useTransition } from 'react';
import Iconify from 'src/components/iconify';
import { deleteSenderAddressById, updateUnverifiedEmails } from 'src/services/db/sender-addresses';
import { sendSenderVerification } from 'src/services/webhook/sender-emails';
import { enqueueSnackbar } from 'notistack';
import { useSearchParams } from 'next/navigation';
import VerificationEmailMessage from '../../email/_components/verification-email-message';

const VerifyAndDeleteAction = ({
  action = 'both',
  id,
}: {
  action?: 'delete' | 'edit' | 'both';
  id: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [isPendingDelete, startTransitionDelete] = useTransition();
  const params = useSearchParams();
  const tableIndex = params.get('tableIndex');

  const handleVerify = () => {
    startTransition(async () => {
      const unverifiedSender = await updateUnverifiedEmails(id); // update unverified email status to "ready"
      const result = await sendSenderVerification({ type: unverifiedSender.type });
      if (result) {
        const message =
          unverifiedSender.type === 'email'
            ? `A verification email has been sent to ${unverifiedSender.value}, click the confirmation link to verify it.`
            : `We are checking ${unverifiedSender.value} for txt record. Check 'Verified Tab' in the next 2 minutes.`;

        enqueueSnackbar({
          message: <VerificationEmailMessage message={message} />,
          variant: 'success',
        });
      }
    });
  };
  const handleDelete = () => {
    startTransitionDelete(async () => {
      if (!tableIndex) return undefined;
      const deleted = await deleteSenderAddressById([id], tableIndex);
      if (!deleted) {
        enqueueSnackbar('Unable to delete. Please contact support.', {
          variant: 'error',
          style: { maxWidth: 400 },
        });
        return undefined;
      }

      enqueueSnackbar('Deleted', { variant: 'success' });
    });
  };

  return (
    <Stack direction="row">
      {action !== 'delete' && (
        <Tooltip title="Verify" placement="top">
          <LoadingButton
            variant="soft"
            sx={{ zIndex: 20, padding: 1 }}
            loading={isPending}
            disabled={isPendingDelete}
            loadingIndicator={
              <Typography fontSize={10} variant="caption">
                Verifying...
              </Typography>
            }
            onClick={handleVerify}
          >
            <Iconify icon="flowbite:edit-outline" width={16} />
            <Typography fontSize={14}>Verify</Typography>
          </LoadingButton>
        </Tooltip>
      )}

      <Tooltip title="Delete" placement="top">
        <LoadingButton
          onClick={handleDelete}
          disabled={isPending}
          loading={isPendingDelete}
          loadingIndicator={
            <Typography fontSize={10} variant="caption">
              Deleting...
            </Typography>
          }
          sx={{ zIndex: 20, color: 'error.main' }}
        >
          <Iconify icon="ph:trash-bold" width={16} />
          <Typography fontSize={14}>Delete</Typography>
        </LoadingButton>
      </Tooltip>
    </Stack>
  );
};

export default VerifyAndDeleteAction;
