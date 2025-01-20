'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import Image from 'next/image';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useGetSeedSettings } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';
import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import * as Yup from 'yup';

export const NewEmailForm = () => {
  const { prefillMessage } = useSalesmateChat();
  const mdUp = useResponsive('up', 'md');

  const theme = useTheme();
  const { hosts } = useGetSeedSettings();

  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('List name is required'),
    hostId: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: format(new Date(), 'MMM do yyyy'),
      hostId: {
        label: '',
        value: '',
      },
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log({ data });
  });

  const renderProperties = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="List name" placeholder="Assig a name to this list" />

              <RHFAutocomplete
                name="hostId"
                label="Choose sender profile"
                placeholder="outreachmagic"
                options={hostOptions}
              />
            </Box>

            <Divider />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
          <Image
            src="/assets/illustrations/seeds/person.png"
            alt="seeds"
            width={250}
            height={250}
            priority
            quality={100}
          />
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Upload CSV List
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            You have 500 verification credits remaining.{' '}
            <Link component={RouterLink} href={paths.checkout.root} variant="subtitle2">
              Upgrade your subscription
            </Link>
            . Or{' '}
            <Link
              variant="subtitle2"
              sx={{ cursor: 'pointer' }}
              onClick={() => prefillMessage('I have questions about the Email Validator')}
            >
              contact us
            </Link>{' '}
            if you have questions.
          </Typography>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            sx={{ boxShadow: theme.customShadows.primary }}
          >
            Generate List
          </LoadingButton>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderProperties}
      </Grid>
    </FormProvider>
  );
};
