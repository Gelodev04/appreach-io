'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Link, Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Logo from 'src/components/logo';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { endpoints } from 'src/utils/swr';
import * as Yup from 'yup';

export default function TrialRegistrationView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  const TrialRegistrationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(TrialRegistrationSchema),
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit } = methods;

  // Redirect to register with email as query parameter
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Check if email exists
      const url = endpoints.auth.checkEmailExists(data.email);
      const body = JSON.stringify(data);

      const response = await fetch(url, { method: 'POST', body });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData?.error || 'Failed to register email');

      router.push(`${paths.checkout.trial2}?email=${data.email}`);
    } catch (error) {
      setErrorMsg(error.message);
    }
  });

  const renderForm = (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="start" spacing={2}>
      <RHFTextField name="email" label="Email address" sx={{ width: 300 }} />
      <Button
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        sx={{ px: 6, height: 50, width: { xs: '100%', md: 'auto' } }}
      >
        Continue
      </Button>
    </Stack>
  );

  return (
    <Container maxWidth="sm" sx={{ height: '100vh' }}>
      <Stack
        spacing={4}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        minHeight="100%"
        width="100%"
      >
        <Stack
          sx={{
            position: { xs: 'absolute', md: 'inherit' },
            top: { xs: 32, md: 'inherit' },
          }}
        >
          <Logo sx={{ width: 300, height: 60 }} />
        </Stack>

        <Typography fontSize={24}>
          Getting started is fast and easy. Just let us know your business email. No credit card
          required.
        </Typography>

        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderForm}
        </FormProvider>

        <Stack direction="row" mt={4} spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
