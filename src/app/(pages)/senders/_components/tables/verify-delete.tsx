import { LoadingButton } from '@mui/lab';
import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useTransition } from 'react';
import Iconify from 'src/components/iconify';
import { updateUnverifiedEmails } from 'src/services/db/verified-domains';
import { requestForEmailVerification } from 'src/services/webhook/email-verification';
import { enqueueSnackbar } from 'notistack';
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
  const handleVerify = () => {
    startTransition(async () => {
      const unverifiedSender = await updateUnverifiedEmails(id); // update unverified email status to "ready"
      const result = await requestForEmailVerification(unverifiedSender);
      if (result) {
        const message =
          unverifiedSender.type === 'email'
            ? `A verification email has been sent to ${unverifiedSender.value}, click the confirmation link to verify it.`
            : `We are checking ${unverifiedSender.value} for txt record. Check 'Verified Tab' in the next 2 minutes.`;

        enqueueSnackbar({
          message: <VerificationEmailMessage message={message} />,
          variant: 'success',
          style: { maxWidth: 400 },
        });
      }
    });
  };
  const wait = () => {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  };
  const handleDelete = () => {
    startTransitionDelete(async () => {
      await wait();
      console.log({ id });
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
