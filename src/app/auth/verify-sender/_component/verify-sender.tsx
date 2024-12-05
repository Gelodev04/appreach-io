'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/swr';
import { useSearchParams } from 'next/navigation';
import { verifySender } from 'src/services/webhook/sender-emails';

export default function VerifySender() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const loading = useBoolean(false);
  const params = useSearchParams();
  const id = params.get('id');
  const token = params.get('token');
  const onSubmit = async () => {
    try {
      if (!id || !token) throw new Error('Invalid or missing URL parameters');
      loading.setValue(true);
      const { message, variant } = await verifySender({ id, token });
      switch (variant) {
        case 'success':
          enqueueSnackbar(message, { variant });
          break;
        case 'info':
          enqueueSnackbar(message, { variant });
          break;
        case 'error':
          enqueueSnackbar(message, { variant });
          break;

        default:
          enqueueSnackbar(message, { variant: 'error' });
          break;
      }
      // Redirect or handle success as needed
      // router.push(paths.auth.login);
    } catch (error) {
      console.log('Error sender verification:', error.message);
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
