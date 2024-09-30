'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { MenuItem } from '@mui/material';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

type Props = {
  expanded?: boolean;
};

export default function RegisterView({ expanded }: Props) {
  const { register } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [successful, setSuccessful] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const email = searchParams.get('email');
  const password = useBoolean();
  const confirmPassword = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    companyName: Yup.string()
      .required('Company name required')
      .max(20, 'Company name can not be longer than 20 characters'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!/@$%^&*-]).{6,}$/,
        'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .nullable()
      .required('Confirm Password is required'),
    emailsPerDay: Yup.string().nullable(),
    hearAboutUs: Yup.string().nullable(),
    freePhoneSupport: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      email: email ?? '',
      password: '',
      confirmPassword: '',
      emailsPerDay: '',
      hearAboutUs: '',
      freePhoneSupport: false,
    },
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
      });

      setSuccessful(true);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      setSuccessful(false);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
      <Stack spacing={1}>
        <Typography variant="h4">Get started absolutely free</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary" href={paths.website.terms}>
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary" href={paths.website.privacy}>
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderCommonOptions = (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label="First name" />
        <RHFTextField name="lastName" label="Last name" />
      </Stack>

      <RHFTextField name="companyName" label="Company name" />
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

      <RHFTextField
        name="confirmPassword"
        label="Confirm Password"
        type={confirmPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify
                  icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );

  const renderExpandedOptions = (
    <>
      <RHFSelect name="emailsPerDay" label="How many emails do you send per day?">
        <MenuItem value="upTo1k" sx={{ color: 'text.secondary' }}>
          Up To 1K
        </MenuItem>
        <MenuItem value="1kto10k" sx={{ color: 'text.secondary' }}>
          1K-10K
        </MenuItem>
        <MenuItem value="10kto100k" sx={{ color: 'text.secondary' }}>
          10K-100K
        </MenuItem>
        <MenuItem value="over100k" sx={{ color: 'text.secondary' }}>
          Over 100K
        </MenuItem>
      </RHFSelect>

      <RHFTextField name="hearAboutUs" label="How did you hear about us?" />

      <RHFCheckbox name="freePhoneSupport" label="Get free phone support" />

      {watch('freePhoneSupport') && (
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enter your phone number below to get free phone support
          </Typography>

          <RHFTextField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:phone-bold" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      )}
    </>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {expanded ? (
        <Stack spacing={2.5} p={1} sx={{ overflowY: 'scroll', maxHeight: { md: 280 } }}>
          {renderCommonOptions}
          {expanded && renderExpandedOptions}
        </Stack>
      ) : (
        renderCommonOptions
      )}

      {expanded && (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {`You will be getting a trial plan which let's you send to 50 of our seed emails per day for
        10 days.`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`If you require additional features to evaluate our service, let us know about your
            specific use case after completing this registration.`}
          </Typography>
        </Stack>
      )}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {successful ? (
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ my: 2 }}>
          <Image
            src="/assets/illustrations/emails/emails-bulk.png"
            alt="signup"
            width={200}
            height={200}
            priority
          />

          <Typography variant="h3">Check Your Mail</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: '' }}>
            Thanks for registering, please verify your email to login.
          </Typography>

          <Link
            component={RouterLink}
            href={returnTo || paths.auth.login}
            color="inherit"
            variant="subtitle2"
            sx={{
              mt: 4,
              alignItems: 'center',
              display: 'inline-flex',
            }}
          >
            <Iconify icon="eva:arrow-ios-back-fill" width={16} />
            Return to sign in
          </Link>
        </Stack>
      ) : (
        <>
          {renderHead}

          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider>

          {renderTerms}
        </>
      )}
    </>
  );
}
