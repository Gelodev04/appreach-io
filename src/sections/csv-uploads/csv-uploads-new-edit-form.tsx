import * as Yup from 'yup';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { ICsvUploadForm } from 'src/types/csv-uploads';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: ICsvUploadForm;
};

export default function CsvUploadsNewEditForm({ currentItem }: Props) {
  const router = useRouter();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    timezone: Yup.string().required('Timezone is required'),
    notificationAddresses: Yup.string().required('Notification addresses are required'),
    externalSenderAddresses: Yup.string(),
    inboxEngagement: Yup.array().of(Yup.string()),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.host || '',
      timezone: currentItem?.timezone || '',
      notificationAddresses: currentItem?.notificationAddresses || '',
      externalSenderAddresses: currentItem?.externalSenderAddresses || '',
      inboxEngagement: currentItem?.inboxEngagement || [],
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
      router.push(paths.dashboard.csvUploads.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const HOSTS = ['outreachmagic', 'adelaidemetrics', 'cw_us', 'cw_uk', 'cw_au'];

  const renderProperties = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={2} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="timezone"
                label="Choose a host"
                placeholder="outreachmagic"
                options={HOSTS.map((host) => `${host}`)}
                getOptionLabel={(option) => option}
              />

              <RHFSelect name="status" label="Sourced from">
                <MenuItem value="Apollo" sx={{ color: 'text.secondary' }}>
                  Apollo
                </MenuItem>
                <MenuItem value="Disabled" sx={{ color: 'text.secondary' }}>
                  GrowMeOrganic (LinkedIn)
                </MenuItem>
              </RHFSelect>
            </Box>
            <Stack>
              <Typography variant="subtitle2">How would you describe this upload?</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} gutterBottom>
                This is the most important name on the report, be descriptive. IE: translation
                companies, 51-200hc, us
              </Typography>
              <RHFTextField name="externalSenderAddresses" placeholder="placeholder text" />
            </Stack>

            <RHFUpload name="csvFile" accept={{ 'text/csv': [] }} />

            <RHFSwitch
              name="engagementAccount"
              label="Replace attributes on records with existing import name"
            />
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
          <Image
            src="/assets/illustrations/csv-uploads/upload-file.png"
            alt="seeds"
            width={250}
            height={250}
          />
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Placeholder text
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            Additional functions and attributes...
          </Typography>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            sx={{ boxShadow: theme.customShadows.primary }}
          >
            {!currentItem ? 'Register new seed' : 'Save Changes'}
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
