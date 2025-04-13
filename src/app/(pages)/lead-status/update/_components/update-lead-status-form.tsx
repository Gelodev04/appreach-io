'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Typography, useTheme } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { RHFDatePicker } from 'src/components/hook-form/rhf-date-picker';
import { useGetSeedSettings } from 'src/hooks/api/seed';
import { useResponsive } from 'src/hooks/use-responsive';
import { paths } from 'src/routes/paths';
import { createLeadStatus } from 'src/services/db/lead-status';
import { getSenderAccountsByHostId } from 'src/services/db/sender-accounts';
import { ConfigDropdownOptions } from 'src/types/dropdown-types';
import { LeadStatusOption } from 'src/types/lead-status';
import * as Yup from 'yup';

type FormType = {
  platformOptions: ConfigDropdownOptions[] | undefined;
  leadStatusOptions: LeadStatusOption[] | undefined;
};

export const UpdateLeadStatusForm = ({ platformOptions, leadStatusOptions }: FormType) => {
  const mdUp = useResponsive('up', 'md');
  const theme = useTheme();
  const router = useRouter();
  const { hosts } = useGetSeedSettings();
  const [isPending, startTransition] = useTransition();

  const [senderAccountOptions, setSenderAccountOptions] = useState<
    Awaited<ReturnType<typeof getSenderAccountsByHostId>>
  >([]);

  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));
  const structuredPlatformOptions = platformOptions!.map((option) => ({
    label: option.display,
    value: option.value,
  }));
  const structuredLeadStatusOptions = leadStatusOptions!.map((option) => ({
    label: option.display,
    value: { leadStatusValue: option.value, sentiment: option.sentiment },
  }));

  const newHostSchema = Yup.object().shape({
    leads: Yup.string()
      .test(
        'email-or-linkedin',
        'Each line must be a valid email or LinkedIn URL (linkedin.com/in/yourusername/)',
        (value) => {
          if (!value) return false;

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const linkedinRegex =
            /^(https:\/\/www\.|http:\/\/)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;

          const lines = value
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line !== '');

          return lines.every((line) => emailRegex.test(line) || linkedinRegex.test(line));
        }
      )
      .required('Leads field is required'),
    platform: Yup.object()
      .shape({
        label: Yup.string().required('Platform label is required'),
        value: Yup.string().required('Platform value is required'),
      })
      .required('Platform is required')
      .nullable()
      .notOneOf([null], 'Platform is required'),
    leadStatus: Yup.object()
      .shape({
        label: Yup.string().required('Lead Status label is required'),
        value: Yup.object().shape({
          leadStatusValue: Yup.string().required('Lead Status value is required'),
          sentiment: Yup.string().required('Lead Status Sentiment is required'),
        }),
      })
      .required('Lead Status is required')
      .nullable()
      .notOneOf([null], 'Lead Status is required'),
    hostId: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required')
      .nullable()
      .notOneOf([null], 'Sender profile is required'),
    sender: Yup.object()
      .shape({
        label: Yup.string().required('Sender account label is required'),
        value: Yup.string().required('Sender account value is required'),
      })
      .required('Sender account is required')
      .nullable()
      .notOneOf([null], 'Sender account is required'),
    eventDate: Yup.date().required('Event date is required'),
    content: Yup.string().optional(),
  });

  const defaultValues = {
    leads: '',
    platform: null,
    leadStatus: null,
    hostId: null,
    sender: null,
    eventDate: new Date(),
    content: '',
  };

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const host = watch('hostId');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const normalizedData = {
        event_timestamp: new Date(data.eventDate).toISOString(),
        platform: data.platform!.value,
        content: {
          body: data.content,
        },
        host_id: data.hostId!.value,
        host_name: data.hostId!.label,
        lead_status: {
          name: data.leadStatus!.value.leadStatusValue,
          sentiment: data.leadStatus!.value.sentiment,
        },
        leads: data.leads
          .split('\n') // Split the string by new lines
          .map((lead) => lead.trim()) // Trim each line
          .filter((lead) => lead !== ''), // Filter out empty lines
        senders: data.sender!.value,
      };

      const response = await createLeadStatus(normalizedData);

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
        return;
      }

      enqueueSnackbar('Lead Status Updated successfully');
      router.push(paths.leadStatus.root);
      router.refresh();
    } catch (error) {
      console.error('Updating lead status failed', error);
      enqueueSnackbar('An unexpected error occurred. Lead status update failed.', {
        variant: 'error',
        persist: true,
      });
    }
  });

  const handleProfileChange = async (value: { label: string; value: string } | null) => {
    if (!value) {
      setSenderAccountOptions([]);
      methods.setValue('sender', null);
      methods.setValue('hostId', null);

      // Trigger validation after resetting the fields
      await methods.trigger('hostId');
      await methods.trigger('sender');
      return;
    }
    methods.setValue('hostId', value);

    startTransition(async () => {
      const senders = await getSenderAccountsByHostId(value?.value!, { sender: true });
      setSenderAccountOptions(senders);
      await methods.trigger('hostId');
    });
  };

  const senderAccountHelperText = () => {
    if (!host) return 'Please select a sender profile first';
    if (isPending) return 'Loading sender accounts...';
    return '';
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <Stack spacing={7} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Typography variant="h5" sx={{ textAlign: 'center' }}>
                  Bulk Update Lead Status
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  Update the status for multiple leads at one time.
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  Paste in one lead per line — either an email address or a LinkedIn URL.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'center',
                  maxWidth: '500px',
                  width: '100%',
                }}
              >
                <RHFTextField
                  name="leads"
                  multiline
                  InputLabelProps={{ shrink: true }}
                  placeholder={`email@example.com\nlinkedin.com/in/example\nhttps://www.linkedin.com/in/example`}
                  minRows={3}
                  label="Leads (one per line)"
                />
              </Box>

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
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  name="platform"
                  label="Choose Platform"
                  options={structuredPlatformOptions}
                />
                <RHFAutocomplete
                  isOptionEqualToValue={(option, value) =>
                    option.value.leadStatusValue === value.value.leadStatusValue
                  }
                  name="leadStatus"
                  label="Choose Lead Status"
                  options={structuredLeadStatusOptions}
                />
                <RHFAutocomplete
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  name="hostId"
                  label="Select Profile"
                  options={hostOptions}
                  onChange={(_, value) => {
                    handleProfileChange(value as { label: string; value: string } | null);
                  }}
                />
                <RHFAutocomplete
                  disabled={!host || isPending}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  name="sender"
                  label="Sender Account"
                  options={[
                    ...senderAccountOptions.map((option) => ({
                      label: option.sender,
                      value: option.sender,
                    })),
                    { label: 'Other / Unknown', value: 'n/a' },
                  ]}
                  helperText={senderAccountHelperText()}
                />
              </Box>

              <RHFDatePicker name="eventDate" label="Event Date" />

              <RHFTextField
                name="content"
                multiline
                InputLabelProps={{ shrink: true }}
                placeholder="e.g. All replied positively after step 2 sequence."
                minRows={3}
                label="Optional Notes"
              />
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
              src="/assets/illustrations/hosts/server.png"
              alt="host"
              width={250}
              height={250}
              priority
            />
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Update Lead Status
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Update the status for multiple leads at one time.
            </Typography>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{ boxShadow: theme.customShadows.primary }}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
