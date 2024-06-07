import * as Yup from 'yup';
import Image from 'next/image';
import moment from 'moment-timezone';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { endpoints } from 'src/utils/swr';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IHost } from 'src/types/host';

// ----------------------------------------------------------------------

type Props = {
  currentItem?: IHost;
};

export default function HostNewEditForm({ currentItem }: Props) {
  const router = useRouter();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const timezones = moment.tz.names();

  const { enqueueSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    host: Yup.string().required('Host name is required'),
    timezone: Yup.string().required('Timezone is required'),
    notificationAddresses: Yup.string(),
    externalSenderAddresses: Yup.string(),
    slack: Yup.object().shape({
      notificationChannelId: Yup.string(),
    }),
    smartLead: Yup.object().shape({
      apiKey: Yup.string(),
      webhook: Yup.string(),
    }),
    inboxEngagement: Yup.object().shape({
      markImportant: Yup.boolean(),
      removeSpam: Yup.boolean(),
      replyMessage: Yup.boolean(),
      clickLink: Yup.boolean(),
      downloadMessage: Yup.boolean(),
      movePrimary: Yup.boolean(),
      scrollMessage: Yup.boolean(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      host: currentItem?.host || '',
      timezone: currentItem?.userSettings.timezone || '',
      notificationAddresses: Array.isArray(currentItem?.userSettings.notificationAddressArray)
        ? currentItem.userSettings.notificationAddressArray.join('\n')
        : currentItem?.userSettings.notificationAddressArray || '',
      externalSenderAddresses: Array.isArray(currentItem?.userSettings.externalSenderAddresses)
        ? currentItem.userSettings.externalSenderAddresses.join('\n')
        : currentItem?.userSettings.externalSenderAddresses || '',
      slack: currentItem?.slack || { notificationChannelId: '' },
      smartLead: currentItem?.smartlead || { apiKey: '', webhook: '' },
      inboxEngagement: {
        markImportant: currentItem?.inboxEngagement?.markImportant || false,
        removeSpam: currentItem?.inboxEngagement?.removeSpam || false,
        replyMessage: currentItem?.inboxEngagement?.replyMessage || false,
        clickLink: currentItem?.inboxEngagement?.clickLink || false,
        downloadMessage: currentItem?.inboxEngagement?.downloadMessage || false,
        movePrimary: currentItem?.inboxEngagement?.movePrimary || false,
        scrollMessage: currentItem?.inboxEngagement?.scrollMessage || false,
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

  const onEdit = handleSubmit(async (data) => {
    try {
      const res = await fetch(endpoints.host.edit, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          _id: currentItem?._id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update host');
      }
      enqueueSnackbar('Update success!');
      router.push(paths.dashboard.host.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const onCreate = handleSubmit(async (data) => {
    try {
      const res = await fetch('/api/host/create', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create host');
      }
      enqueueSnackbar('Create success!');
      router.push(paths.dashboard.host.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const externalSenderAddressesPlaceholder = `carlos@outreachmagic.io ⏎
mark@outreachmagic.io ⏎
abdulrehman@outreachmagic.io ⏎`;

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
                name="host"
                label="Host name"
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
              name="notificationAddresses"
              label="Notification addresses (separated by newlines)"
              minRows={3}
              multiline
              placeholder={externalSenderAddressesPlaceholder}
            />
            <RHFTextField
              name="externalSenderAddresses"
              label="External sender addresses (separated by newlines)"
              minRows={3}
              multiline
              placeholder={externalSenderAddressesPlaceholder}
            />

            <RHFTextField
              name="slack.notificationChannelId"
              label="Slack notification channel ID"
              placeholder="C06SWJC9V47"
            />

            <RHFTextField
              name="smartLead.apiKey"
              label="Smart lead API key"
              placeholder="cfeda7bf-2f21-4d9e-8bf2-082f31f29acb_o26lz3v"
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Inbox engagement</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <RHFCheckbox name="inboxEngagement.markImportant" label="Mark as important" />
                <RHFCheckbox name="inboxEngagement.removeSpam" label="Remove from spam" />
                <RHFCheckbox name="inboxEngagement.replyMessage" label="Reply message" />
                <RHFCheckbox name="inboxEngagement.clickLink" label="Click link" />
                <RHFCheckbox name="inboxEngagement.downloadMessage" label="Download message" />
                <RHFCheckbox name="inboxEngagement.movePrimary" label="Move to primary" />
                <RHFCheckbox name="inboxEngagement.scrollMessage" label="Scroll message" />
              </Box>
            </Stack>
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} md={4}>
        <Stack alignItems={mdUp ? 'flex-start' : 'center'}>
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
            {!currentItem ? 'Register new host' : 'Save Changes'}
          </LoadingButton>
        </Stack>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={currentItem ? onEdit : onCreate}>
      <Grid container spacing={3}>
        {renderProperties}
      </Grid>
    </FormProvider>
  );
}
