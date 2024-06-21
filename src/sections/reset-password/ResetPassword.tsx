'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { RouterLink } from 'src/routes/components';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';

export default function ResetPasswordView() {
  const { forgotPassword } = useAuthContext();
  const router = useRouter();

  const [id, setId] = useState<any>("");
  const [token, setToken] = useState<any>("");
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const Id = urlParams.get('id');
    const Token = urlParams.get('token');
    setId(Id);
    setToken(Token);
  }, []); // Only run once on component mount

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(12, 'Password must be at least 12 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
        'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .nullable()
      .required('Confirm Password is required'),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!id || !token) {
        throw new Error('Invalid or missing URL parameters');
      }

      const url = `https://be0f-2a02-c206-2181-7947-00-1.ngrok-free.app/reset-password/?id=${id}&token=${token}`; // Replace with your API endpoint
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const body = new URLSearchParams({
        password: data.password,
      }).toString();

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

   
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to reset password');
      }
     
      console.log('Reset password response:', responseData);
      enqueueSnackbar(responseData?.message || 'Password reset successfully', { variant: 'success' });
      // Redirect or handle success as needed
      const href = `${paths.auth.login}`;
      router.push(href);
    } catch (error) {
      console.log('Error resetting password:', error.message);
      enqueueSnackbar(error.message, { variant: 'error' });
      // Handle error, show error message, etc.
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="password" type="password" label="Password" />
      <RHFTextField name="confirmPassword" type="password" label="Confirm Password" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Reset Password
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
        <Typography variant="h3">Create Your New Password</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please ensure your new password is at least 12 characters long and includes a mix of letters, numbers, and symbols.
        </Typography>
      </Stack>
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
