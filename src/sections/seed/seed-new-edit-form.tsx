import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { format } from 'date-fns';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useGetSeedAccounts, useGetSeedSettings } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';
import useSalesmateChat from 'src/hooks/use-salesmate-chat';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { ISeedForm } from 'src/types/seed';
import { endpoints } from 'src/utils/swr';
import * as Yup from 'yup';
import SeedAccountsGenerator from './seed-accounts-generator';

type Props = {
  currentItem?: ISeedForm;
};

export default function SeedNewEditForm({ currentItem }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const { hosts, assignedCount } = useGetSeedSettings();
  const { seedAccounts } = useGetSeedAccounts();
  const { enqueueSnackbar } = useSnackbar();
  const { prefillMessage } = useSalesmateChat();

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    hostId: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required'),
    googleBusiness: Yup.number(),
    googlePersonal: Yup.number(),
    microsoftBusiness: Yup.number(),
    microsoftPersonal: Yup.number(),
    // yahooPersonal: Yup.number(), not needed anymore
    totalSeedAccounts: Yup.number(),
    seedAccountsGenerator: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || format(new Date(), 'MMM do yyyy'),
      hostId: {
        label: '',
        value: '',
      },
      googleBusiness: currentItem?.generate.esps.googleBusiness || 0,
      googlePersonal: currentItem?.generate.esps.googlePersonal || 0,
      microsoftBusiness: currentItem?.generate.esps.microsoftBusiness || 0,
      microsoftPersonal: currentItem?.generate.esps.microsoftPersonal || 0,
      yahooPersonal: currentItem?.generate.esps.yahooPersonal || 0,
      totalSeedAccounts: currentItem?.generate.total || 0,
      seedAccountsGenerator: 0,
    }),
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    getValues,
  } = methods;

  const seedAccountsGenerator = watch('seedAccountsGenerator');
  const googleBusiness = watch('googleBusiness');
  const googlePersonal = watch('googlePersonal');
  const microsoftBusiness = watch('microsoftBusiness');
  const microsoftPersonal = watch('microsoftPersonal');
  const totalSeedAccounts = watch('totalSeedAccounts');
  // const yahooPersonal = watch('yahooPersonal'); not needed anymore

  useEffect(() => {
    if (currentItem) {
      reset(defaultValues);
    }
  }, [currentItem, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = JSON.stringify(data);
      const res = await fetch(endpoints.seed.create, { method: 'POST', body });

      if (!res.ok) throw new Error('Failed to create seed batch');

      enqueueSnackbar('Create success!');
      router.push(paths.seed.root);
      router.refresh();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));

  const handleSalesmateOpen = () => {
    prefillMessage('I am interested in more seeds account.');
  };

  useEffect(() => {
    const total = getValues('seedAccountsGenerator');
    const individualFields = [
      'googleBusiness',
      'googlePersonal',
      'microsoftBusiness',
      'microsoftPersonal',
    ];
    const count = individualFields.length;

    if (total && total > 0) {
      const distributedValue = Math.floor(total / count);
      const remaining = total % count;

      individualFields.forEach((field, index) => {
        setValue(field as any, distributedValue + (index === count - 1 ? remaining : 0));
      });
    }
  }, [getValues, setValue, seedAccountsGenerator]); // Watch totalInputField

  useEffect(() => {
    const total =
      (googleBusiness ?? 0) +
      (googlePersonal ?? 0) +
      (microsoftBusiness ?? 0) +
      (microsoftPersonal ?? 0);
    setValue('totalSeedAccounts', total);
  }, [
    googleBusiness,
    googlePersonal,
    microsoftBusiness,
    microsoftPersonal,
    setValue,
    seedAccountsGenerator,
  ]);

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
              <RHFTextField
                name="name"
                label="List name"
                placeholder="Assig a name to this list"
                disabled={!!currentItem}
              />

              <RHFAutocomplete
                name="hostId"
                label="Choose sender profile"
                placeholder="outreachmagic"
                options={hostOptions}
              />
            </Box>

            <Divider />

            <SeedAccountsGenerator
              assignedCount={assignedCount}
              seedAccounts={seedAccounts || []}
              totalSeedAccounts={totalSeedAccounts}
            />
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
            Generate new list
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            You can send to {assignedCount} email accounts each day.{' '}
            <Link href={paths.checkout.root} variant="subtitle2">
              Upgrade your subscription
            </Link>
            . Or{' '}
            <Link variant="subtitle2" sx={{ cursor: 'pointer' }} onClick={handleSalesmateOpen}>
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
            {!currentItem ? 'Generate list' : 'Save Changes'}
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
}
