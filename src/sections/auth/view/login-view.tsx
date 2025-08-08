'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

export default function LoginView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Reset verification state
      setShowResendVerification(false);

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        console.log({ error: result.error });

        // Check if it's an AccessDenied error (from signIn callback)
        if (result.error === 'AccessDenied') {
          setUserEmail(data.email);
          setShowResendVerification(true);
          return; // Don't show snackbar, show resend verification instead
        }
        throw new Error('Invalid Credentials');
      }

      console.log({ result: result?.url });
      // Handle redirect after successful login if needed
      if (result?.url) {
        router.push(result.url);
      }

      enqueueSnackbar('Login successful', { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      const response = await axios.post('/api/auth/resend-verification', {
        email: userEmail,
      });

      enqueueSnackbar(response.data.message, { variant: 'success' });
      setShowResendVerification(false);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to resend verification email';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsResending(false);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Outreach Magic</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.checkout.signup2} variant="subtitle2">
          Signup for a free trial
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end' }}
        href={paths.auth.forgotPassword}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>

      {showResendVerification && (
        <Stack spacing={1} sx={{ mt: 2, p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.dark">
            Email has not been verified, would you like us to resend the verification link?
          </Typography>
          <LoadingButton
            variant="contained"
            color="warning"
            size="small"
            onClick={handleResendVerification}
            loading={isResending}
            disabled={isResending}
          >
            Resend Verification Email
          </LoadingButton>
        </Stack>
      )}
    </Stack>
  );

  return (
    <>
      {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
