'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/swr';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const [resp, setResp] = useState<any>('');
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     await forgotPassword?.(data.email);

  //     const href = `${paths.auth.forgotPassword}`;
  //     router.push(href);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
  const onSubmit = handleSubmit(async (data) => {
    try {
      const url = endpoints.auth.resetPassword;
      const headers = {
        'Content-Type': 'application/json',
      };

      const body = JSON.stringify({
        email: data.email,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData?.error || 'Failed to reset password');

      setResp(responseData);
      // Redirect or handle success as needed
      const href = `${paths.auth.forgotPassword}`;
      router.push(href);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });

      console.error('Error resetting password:', error);
      // Handle error, show error message, etc.
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send Request
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <Stack alignItems="center">
      <Image
        src="/assets/illustrations/auth/lock.png"
        width={160}
        height={160}
        alt="password"
        priority
      />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and We will email you a link
          to reset your password.
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {resp === '' ? (
        <>
          {' '}
          {renderHead}
          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider>
        </>
      ) : (
        <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
          <Typography variant="h3">Check Your Mail</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {resp?.message}
          </Typography>
        </Stack>
      )}
    </>
  );
}
