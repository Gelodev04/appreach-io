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
  RHFSwitch,
  RHFSelect,
  RHFCheckbox,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IAddEmailsBulk } from 'src/types/emails';
// ----------------------------------------------------------------------

type Props = {
  currentItem?: IAddEmailsBulk;
};

export default function AddEmailsBulkForm({ currentItem }: Props) {
  const router = useRouter();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    host: Yup.string().required('Host is required'),
    accounts: Yup.string().required('Accounts are required'),
    status: Yup.string().required('Status is required'),
    engagementAccount: Yup.boolean(),
    placementAccount: Yup.boolean(),
    engagementApi: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      host: currentItem?.host || '',
      accounts: currentItem?.accounts || '',
      status: currentItem?.status || 'Active',
      engagementAccount: currentItem?.engagementAccount || false,
      placementAccount: currentItem?.placementAccount || false,
      engagementApi: currentItem?.engagementApi || false,
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

  const accountsPlaceholder = `carlos@outreachmagic.io ⏎
mark@outreachmagic.io ⏎
abdulrehman@outreachmagic.io ⏎`;

  const HOSTS = ['outreachmagic', 'adelaidemetrics', 'cw_us', 'cw_uk', 'cw_au'];

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
              <RHFAutocomplete
                name="timezone"
                label="Choose a host"
                placeholder="outreachmagic"
                options={HOSTS.map((host) => `${host}`)}
                getOptionLabel={(option) => option}
              />

              <RHFSelect name="status">
                <MenuItem value="Active" sx={{ color: 'text.secondary' }}>
                  Active
                </MenuItem>
                <MenuItem value="Disabled" sx={{ color: 'text.secondary' }}>
                  Disabled
                </MenuItem>
              </RHFSelect>
            </Box>

            <RHFTextField
              name="accounts"
              label="Accounts (separated by newlines)"
              rows={3}
              multiline
              placeholder={accountsPlaceholder}
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Settings</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between">
                <Stack direction={{ xs: 'column', sm: 'row' }}>
                  <RHFCheckbox name="engagementAccount" label="Engagement Account" />
                  <RHFCheckbox name="placementAccount" label="Placement Account" />
                </Stack>
                <RHFSwitch name="engagementApi" label="Engagement API" />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
          <Image
            src="/assets/illustrations/emails/emails-bulk.png"
            alt="seeds"
            width={250}
            height={250}
            priority
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
            {!currentItem ? 'Add emails' : 'Save Changes'}
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
