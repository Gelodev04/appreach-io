'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/hooks';
import FormProvider, { RHFMultiSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { PlatformOptionsType } from 'src/types/dropdown-types';
import * as Yup from 'yup';
import RegisterCommonForm from '../register-common-form';

type Props = {
  platformOptions: PlatformOptionsType;
};

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  currentPlatforms: string[];
  otherPlatforms?: string;
  hearAboutUs: string;
};

export default function RegisterView({ platformOptions }: Props) {
  const { register } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');
  const [successful, setSuccessful] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const email = searchParams.get('email');

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
    // emailsSendsPerDay: Yup.string().required('Choose an option'),
    // freePhoneSupport: Yup.boolean(),
    // phoneNumber: Yup.string().when('freePhoneSupport', ([freePhoneSupport], schema) => {
    //   return freePhoneSupport ? schema.required('Phone number is required') : schema.nullable();
    // }),
    currentPlatforms: Yup.array()
      .min(1, 'Select at least one platform')
      .required('Select at least one platform'),
    otherPlatforms: Yup.string().when('currentPlatforms', {
      is: (currentPlatforms: string[]) =>
        Array.isArray(currentPlatforms) && currentPlatforms.includes('other'),
      then: (schema) => schema.required('Please list other platforms'),
      otherwise: (schema) => schema.notRequired(),
    }),
    hearAboutUs: Yup.string().required(' '),
  });

  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      email: email ?? '',
      password: '',
      confirmPassword: '',
      // emailsSendsPerDay: '',
      // freePhoneSupport: false,
      // phoneNumber: '',
      currentPlatforms: [],
      otherPlatforms: '',
      hearAboutUs: '',
    },
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log({ dataFromForm: data });
    try {
      await register?.({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        isTrial: true,
        // phoneNumber: data.phoneNumber ?? undefined,
        hearAboutUs: data.hearAboutUs ?? undefined,
        platforms: [
          ...data.currentPlatforms.filter((item) => item !== 'other'),
          ...(data.currentPlatforms.includes('other') ? [data.otherPlatforms] : []),
        ].join(', '),
        // emailsSendsPerDay: data.emailsSendsPerDay ?? undefined,
        // callRequested: data.freePhoneSupport ?? false,
      });

      setSuccessful(true);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
      setSuccessful(false);
    }
  });
  const selectedPlatforms = watch('currentPlatforms') ?? [];

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
      {/* <RHFSelect name="emailsSendsPerDay" label="How many emails do you send per day?">
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
      </RHFSelect> */}

      <RHFMultiSelect
        name="currentPlatforms"
        options={platformOptions}
        label="Select all the platforms you currently use"
      />

      {selectedPlatforms.includes('other') && (
        <RHFTextField
          name="otherPlatforms"
          label="List all other platforms you use not listed above"
        />
      )}

      {/* <RHFAutocomplete
        isOptionEqualToValue={(option, value) =>
          option.value.leadStatusValue === value.value.leadStatusValue
        }
        name="leadStatus"
        label="Choose Lead Status"
        options={structuredLeadStatusOptions}
      /> */}

      <RHFTextField name="hearAboutUs" label="How did you hear about us?" />
      {/* <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            You will receive a trial plan that allows you to test our software for 10 days. We
            highly recommend checking the box below to make the most of your trial.
          </Typography>
        </Stack> */}

      {/* <Stack spacing={1}>
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
      </Stack> */}
    </>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack position="relative" spacing={2.5} p={1}>
        <RegisterCommonForm />
        {renderExpandedOptions}
      </Stack>

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
