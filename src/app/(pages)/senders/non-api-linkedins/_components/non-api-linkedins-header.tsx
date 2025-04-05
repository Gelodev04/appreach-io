'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useGetSeedSettings } from 'src/hooks/api/seed';
import { useBoolean } from 'src/hooks/use-boolean';
import { createSenderAccount } from 'src/services/db/sender-accounts';
import * as Yup from 'yup';

export const NonApiLinkedinsHeader = () => {
  const dialog = useBoolean();

  const { hosts } = useGetSeedSettings();
  const hostOptions = hosts.map((host) => ({ label: host.host, value: host._id }));

  const theme = useTheme();
  const newHostSchema = Yup.object().shape({
    linkedinUrl: Yup.string()
      .matches(
        /^(https:\/\/www\.|http:\/\/)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
        'Invalid LinkedIn URL format. Use: linkedin.com/in/yourusername/'
      )
      .required('Linkedin URL is required'),
    senderName: Yup.string().required('Sender Name is required'),
    hostId: Yup.object()
      .shape({
        label: Yup.string().required('Sender profile label is required'),
        value: Yup.string().required('Sender profile value is required'),
      })
      .required('Sender profile is required')
      .nullable()
      .notOneOf([null], 'Sender profile is required'),
  });

  const defaultValues = {
    linkedinUrl: '',
    senderName: '',
    hostId: null,
  };

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Create document in the database
      const response = await createSenderAccount(data);

      if (!response.success) {
        enqueueSnackbar(response.message, { variant: 'error', persist: true });
        return;
      }

      enqueueSnackbar('Uploaded successfully');
      dialog.onFalse();
    } catch (error) {
      console.error('File upload failed', error);
      enqueueSnackbar('An unexpected error occurred during the file upload.', {
        variant: 'error',
        persist: true,
      });
    }
  });

  return (
    <CustomBreadcrumbs
      heading="Manually Added Linkedin Senders"
      links={[{ name: 'Linkedin Senders' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={dialog.onTrue}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Linkedin Account
          </Button>

          <ConfirmDialog
            title="Add New Linkedin Sender"
            hideCancelButton
            open={dialog.value}
            hideActions
            onClose={() => {
              dialog.onFalse();
            }}
            content={
              <FormProvider methods={methods} onSubmit={onSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <RHFTextField
                    name="linkedinUrl"
                    label="Linkedin URL"
                    placeholder="linkedin.com/in/spencermcmurtry"
                    sx={{ mt: 1 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <RHFTextField
                    name="senderName"
                    label="Sender name"
                    placeholder="Spencer McMurtry"
                    InputLabelProps={{ shrink: true }}
                    sx={{ mt: 1 }}
                  />

                  <RHFAutocomplete
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    name="hostId"
                    label="Choose sender profile"
                    placeholder="outreachmagic"
                    options={hostOptions}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 3 }}>
                  <Button variant="outlined" onClick={dialog.onFalse}>
                    Cancel
                  </Button>

                  <LoadingButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{ ml: 2, boxShadow: theme.customShadows.primary }}
                  >
                    Add Account
                  </LoadingButton>
                </Box>
              </FormProvider>
            }
          />
        </Stack>
      }
    />
  );
};
