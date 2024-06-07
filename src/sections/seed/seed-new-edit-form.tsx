import * as Yup from 'yup';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetSeedSettings } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { ISeedForm } from 'src/types/seed';

import SeedAccountsGenerator from './seed-accounts-generator';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: ISeedForm;
};

export default function SeedNewEditForm({ currentItem }: Props) {
  const router = useRouter();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { hosts, assignedCount } = useGetSeedSettings();

  const { enqueueSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    hostId: Yup.string().required('Host is required'),
    generate: Yup.object().shape({
      esps: Yup.object().shape({
        googleBusiness: Yup.number(),
        googlePersonal: Yup.number(),
        microsoftBusiness: Yup.number(),
        microsoftPersonal: Yup.number(),
        yahooPersonal: Yup.number(),
      }),
      type: Yup.string(),
      total: Yup.number().required('Total is required'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      hostId: currentItem?.hostId || '',
      generate: currentItem?.generate || {
        esps: {
          googleBusiness: 0,
          googlePersonal: 0,
          microsoftBusiness: 0,
          microsoftPersonal: 0,
          yahooPersonal: 0,
        },
        total: 0,
        type: '',
      },
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
  } = methods;

  useEffect(() => {
    if (currentItem) {
      reset(defaultValues);
    }
  }, [currentItem, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentItem ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.host.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));

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
                name="host"
                label="Choose a host"
                placeholder="outreachmagic"
                options={hostOptions}
              />
            </Box>

            <Divider />

            <SeedAccountsGenerator assignedCount={assignedCount} />
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
            Create new list
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            You can send to {assignedCount} email accounts each day. Contact us if you have
            questions or you need more accounts.
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
