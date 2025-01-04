import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import moment from 'moment-timezone';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { SenderProfileTabs } from 'src/app/(pages)/profiles/edit/[hostId]/_components';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { HostProps } from 'src/types/host';
import { endpoints } from 'src/utils/swr';
import * as Yup from 'yup';
import { useDefaultEngagementSettings } from './hooks/useSetValues';

export default function HostNewEditForm({ currentItem, planPermissions }: HostProps) {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const updatedHostItem = useDefaultEngagementSettings(currentItem);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const timezones = moment.tz.names();

  const newHostSchema = Yup.object().shape({
    host: Yup.string().required('Host name is required'),
    timezone: Yup.string().required('Timezone is required'),
    notificationAddresses: Yup.string(),
    externalSenderAddresses: Yup.string(),
    smartLead: Yup.object().shape({
      // apiKey: Yup.string(),
      webhook: Yup.string(),
    }),
    // scrollMessage: Yup.number(),
    // markImportant: Yup.number(),
    // removeSpam: Yup.number(),
    // movePrimary: Yup.number(),
    // clickLink: Yup.number(),
    // replyMessage: Yup.number(),
    // linksToClick: Yup.string().required('This field cannot be empty.'),
    // linksNotToClick: Yup.string().required('This field cannot be empty.'),
    // filterId: Yup.string().required('Filter ID is required'),
    // replyPrompt: Yup.string().required('Reply prompt is required'),
  });

  const defaultValues = {
    host: updatedHostItem?.host || '',
    timezone: updatedHostItem?.userSettings?.timezone || '',
    notificationAddresses: Array.isArray(updatedHostItem?.userSettings?.notificationAddressArray)
      ? updatedHostItem.userSettings?.notificationAddressArray.join('\n')
      : updatedHostItem?.userSettings?.notificationAddressArray || '',
    externalSenderAddresses: Array.isArray(updatedHostItem?.userSettings?.externalSenderAddresses)
      ? updatedHostItem.userSettings?.externalSenderAddresses.join('\n')
      : updatedHostItem?.userSettings?.externalSenderAddresses || '',
    // slack: currentItem?.slack || { notificationChannelId: '' },
    smartLead: updatedHostItem?.smartlead || { /* apiKey: '', */ webhook: '' },
  };

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onEdit = handleSubmit(async (data) => {
    try {
      const res = await fetch(endpoints.host.edit, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          _id: currentItem?.id,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to update host');
      }
      closeSnackbar();
      enqueueSnackbar('Update success!');
      router.push(paths.settings.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error', persist: true });
    }
  });

  const onCreate = handleSubmit(async (data) => {
    try {
      const res = await fetch(endpoints.host.create, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Failed to create host');
      }
      closeSnackbar();
      enqueueSnackbar('Create success!');
      router.push(paths.settings.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error', persist: true });
    }
  });

  const externalSenderAddressesPlaceholder = `carlos@outreachmagic.io ⏎
mark@outreachmagic.io ⏎
abdulrehman@outreachmagic.io ⏎`;

  return (
    <FormProvider methods={methods} onSubmit={currentItem ? onEdit : onCreate}>
      <Grid container spacing={3}>
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
                  name="host"
                  label="Sender profile name"
                  placeholder="outreachmagic"
                  disabled={!!currentItem}
                />

                <RHFAutocomplete
                  name="timezone"
                  label="Timezone"
                  placeholder="Choose a timezone"
                  options={timezones.map((timezone) => `${timezone}`)}
                  getOptionLabel={(option) => option}
                />
              </Box>

              <RHFTextField
                name="externalSenderAddresses"
                label="Sender addresses (separated by newlines)"
                minRows={3}
                maxRows={5}
                multiline
                placeholder={externalSenderAddressesPlaceholder}
              />

              <SenderProfileTabs currentItem={updatedHostItem} planPermissions={planPermissions} />
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack
            alignItems={mdUp ? 'flex-start' : 'center'}
            sx={{
              position: 'sticky',
              top: '4rem',
            }}
          >
            <Image
              src={
                currentItem
                  ? '/assets/illustrations/hosts/server-2.png'
                  : '/assets/illustrations/hosts/server.png'
              }
              alt="host"
              width={250}
              height={250}
              priority
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {currentItem ? 'Edit sender profile' : 'Add sender profile'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Edit your sender profile engagement settings.
            </Typography>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{ boxShadow: theme.customShadows.primary }}
            >
              {currentItem ? 'Save Changes' : 'Add sender profile'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
