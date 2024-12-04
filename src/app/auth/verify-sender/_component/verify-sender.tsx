'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/swr';

export default function VerifySender({ id, token }: { id: string; token: string }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useBoolean(false);

  const onSubmit = async () => {
    try {
      if (!id || !token) throw new Error('Invalid or missing URL parameters');

      loading.setValue(true);
      const url = endpoints.auth.verifyAccount;
      const body = JSON.stringify({ id, token });
      const response = await fetch(url, { method: 'POST', body });
      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || 'Failed to verify account');

      enqueueSnackbar(responseData?.message || 'Account verified successfully', {
        variant: 'success',
      });

      // Redirect or handle success as needed
      router.push(paths.auth.login);
    } catch (error) {
      console.log('Error verifying account:', error.message);
      enqueueSnackbar(error.message, { variant: 'error' });
      // Handle error, show error message, etc.
    } finally {
      loading.setValue(false);
    }
  };

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={onSubmit}
        loading={loading.value}
      >
        Verify Sender
      </LoadingButton>
    </Stack>
  );

  const renderHead = (
    <Stack alignItems="center">
      <Image
        src="/assets/illustrations/emails/emails-bulk.png"
        width={160}
        height={160}
        alt="verify-account"
        priority
      />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Verify Sender Address</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Click on the button below to verify your sender address.
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}
      {renderForm}
    </>
  );
}
