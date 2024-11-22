import { LoadingButton } from '@mui/lab';
import { Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useTransition } from 'react';
import Iconify from 'src/components/iconify';
import { updateUnverifiedEmails } from 'src/services/db/verified-domains';
import { requestForEmailVerification } from 'src/services/webhook/email-verification';
import { enqueueSnackbar } from 'notistack';
import VerificationEmailMessage from '../../email/_components/verification-email-message';

const EditDeleteAction = ({
  action = 'both',
  id,
}: {
  action?: 'delete' | 'edit' | 'both';
  id: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const handleVerify = () => {
    startTransition(async () => {
      const unverifiedEmail = await updateUnverifiedEmails(id);
      const result = await requestForEmailVerification(unverifiedEmail);
      if (result) {
        enqueueSnackbar({
          message: <VerificationEmailMessage name={unverifiedEmail.value} />,
          variant: 'success',
          persist: true,
        });
      }
    });
  };

  return (
    <Stack direction="row">
      {action !== 'delete' && (
        <Tooltip title="Edit" placement="top">
          <LoadingButton
            variant="outlined"
            sx={{ zIndex: 20 }}
            loading={isPending}
            onClick={handleVerify}
          >
            <Iconify icon="flowbite:edit-outline" />
            <Typography>Verify</Typography>
          </LoadingButton>
        </Tooltip>
      )}

      <Tooltip title="Delete" placement="top">
        <Button onClick={() => {}} sx={{ zIndex: 20, color: 'error.main' }}>
          <Iconify icon="ph:trash-bold" />
          <Typography>Delete</Typography>
        </Button>
      </Tooltip>
    </Stack>
  );
};

export default EditDeleteAction;
