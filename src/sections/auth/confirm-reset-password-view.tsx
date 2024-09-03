'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/swr';
import * as Yup from 'yup';

export default function ConfirmResetPasswordView({ id, token }: { id: string; token: string }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-#<>[\]\\])[A-Za-z\d@$!%*?&\-#<>[\]\\]{6,}$/,
        'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .nullable()
      .required('Confirm Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!id || !token) throw new Error('Invalid or missing URL parameters');

      const url = endpoints.auth.confirmResetPassword;
      const body = JSON.stringify({ id, password: data.password, token });
      const response = await fetch(url, { method: 'POST', body });
      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || 'Failed to reset password');

      console.log('Reset password response:', responseData);
      enqueueSnackbar(responseData?.message || 'Password reset successfully', {
        variant: 'success',
      });

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
          Please ensure your new password is at least 12 characters long and includes a mix of
          letters, numbers, and symbols.
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
