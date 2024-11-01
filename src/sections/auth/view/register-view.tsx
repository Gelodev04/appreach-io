'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, InputAdornment, MenuItem } from '@mui/material';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';
import moment from 'moment-timezone';
import RegisterCommonForm from '../register-common-form';

type Props = {
  expanded?: boolean;
};

export default function RegisterView({ expanded }: Props) {
  const { register } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const email = searchParams.get('email');

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const shouldShowOverlay = event.currentTarget.scrollTop === 0;
    setShowOverlay(shouldShowOverlay);
  };

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
    ...(expanded && {
      emailsSendsPerDay: Yup.string().required('Choose an option'),
      hearAboutUs: Yup.string().required(' '),
      freePhoneSupport: Yup.boolean(),
      phoneNumber: Yup.string().when('freePhoneSupport', ([freePhoneSupport], schema) => {
        return freePhoneSupport ? schema.required('Phone number is required') : schema.nullable();
      }),
    }),
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
      emailsSendsPerDay: '',
      hearAboutUs: '',
      freePhoneSupport: false,
      phoneNumber: '',
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
        ...(expanded && {
          phoneNumber: data.phoneNumber ?? undefined,
          hearAboutUs: data.hearAboutUs ?? undefined,
          emailsSendsPerDay: data.emailsSendsPerDay ?? undefined,
          callRequested: data.freePhoneSupport ?? false,
        }),
        plan: {
          status: 'trialing',
          start_date: new Date(),
          current_period_end: new Date(moment().add(10, 'days').toDate()),
          trial_end: new Date(moment().add(10, 'days').toDate()),
        },
        seeds: {
          assignedCount: 50,
        },
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

  const renderExpandedOptions = (
    <>
      <RHFSelect name="emailsSendsPerDay" label="How many emails do you send per day?">
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
      {expanded && (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {`You will be getting a trial plan which let's you send to 50 of our seed emails per day for 10 days.`}
          </Typography>
        </Stack>
      )}

      <Stack spacing={1}>
        <RHFCheckbox
          name="freePhoneSupport"
          label="Check here to have a team member contact you with features tailored to your use case."
        />

        {watch('freePhoneSupport') && (
          <Stack spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              What is the best number to text you at? (ex: +1 555-555-5555)
            </Typography>

            <RHFTextField
              name="phoneNumber"
              label="Phone Number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify icon="solar:phone-bold" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        )}
      </Stack>
    </>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {expanded ? (
        <Stack
          position="relative"
          spacing={2.5}
          p={1}
          onScroll={handleScroll}
          sx={{
            overflowX: 'hidden',
            overflowY: 'scroll',
            maxHeight: { md: 440 },
          }}
        >
          <RegisterCommonForm />
          {expanded && renderExpandedOptions}

          {/* Blurred arrow */}
          {expanded && showOverlay && (
            <Box
              position="absolute"
              bottom={0}
              display={{ xs: 'none', md: 'flex' }}
              justifyContent="center"
              alignItems="center"
              width={1}
              height={20}
              sx={{
                background: 'linear-gradient(to top, rgba(255,255,255, 1), rgba(255,255,255, 0))',
              }}
            >
              <Iconify icon="mingcute:arrow-down-line" width={20} height={20} />
            </Box>
          )}
        </Stack>
      ) : (
        <RegisterCommonForm />
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
