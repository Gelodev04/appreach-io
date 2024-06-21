'use client';

import * as Yup from 'yup';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const { forgotPassword } = useAuthContext();
const [resp,setResp]=useState<any>("");
  const router = useRouter();

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
      const url = 'https://be0f-2a02-c206-2181-7947-00-1.ngrok-free.app/reset-password'; // Replace with your API endpoint
      const headers = {
        'Content-Type': 'application/json',
        // 'Cookie': 'session=.eJztkk1rwzAMhv-K8DmUNEm71NdCxwa7bLmMUYJSK4lZYneWsw5K__u8lnbs6zbYBjsJW3pe6UXairLukFtiIe-2AnwIgpyzTkRibk2tXQ9rZN5YpyQsNHUK-oE9VAT0MGAH3p4KRmK5iz6osKtD0T0ZCUVLML-5XhzeoBl6zaxN84bsiRkbCuytHdxJHVrk0DZwjpj8CEIWVmjA2A10ttHm0_Y_ZOJIXphH7LQC64Ce1tqROnD_s_6C4zga3jOvWi4MT-y_l1ijw548Of6LVV_6XUZiFZZYHg5Finia40RVqDDHs4TqPKZ8lSo1m6XjNKUkSausquKXBe41y6OmkNP3X6VCT0KGmUJWFO0QQRLD5WBCSDIYJ3KSyfEEzq8Ksds9A3H_nVg.ZnQqjw.2fKH5U8oqvggFegzjNGiWNDOFDM' // Replace with your actual session cookie value
      };

      const body = JSON.stringify({
        email: data.email,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const responseData = await response.json();
      setResp(responseData)
      console.log('Reset password response:', responseData);

      // Redirect or handle success as needed
      const href = `${paths.auth.forgotPassword}`;
      router.push(href);
    } catch (error) {
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
     {resp===""?(<> {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider></>):(
    
   <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
   <Typography variant="h3">Check Your Mail</Typography>

   <Typography variant="body2" sx={{ color: 'text.secondary' }}>
     {resp?.message}
   </Typography>
 </Stack>)
      }
</>
  );
}
