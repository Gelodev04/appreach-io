'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, InputAdornment, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { updateUserSettings } from 'src/services/db/user-settings';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type userAPI = {
  token: string;
  updated_at: Date;
  webhook: {
    notification_email: string;
  };
};

export const AccountSettingsForm = ({ userApi }: { userApi: userAPI }) => {
  const { copy } = useCopyToClipboard();
  const { enqueueSnackbar } = useSnackbar();
  const [apiKey, setApiKey] = useState(userApi.token);
  console.log({ userApi });
  const [isRegeneratingApiKey, startRegeneratingApiKey] = useTransition();

  const handleCopyApiKey = () => {
    copy(apiKey);
    enqueueSnackbar('API key copied to clipboard', { autoHideDuration: 2000 });
  };

  const handleRegenerateApiKey = async () => {
    startRegeneratingApiKey(async () => {
      try {
        const response = await axios.post('/api/user-generate-api-key');

        if (response.data.success) {
          setApiKey(response.data.apiKey);
          enqueueSnackbar('API key regenerated successfully', { variant: 'success' });
        } else {
          enqueueSnackbar(response.data.message || 'Failed to regenerate API key', {
            variant: 'error',
            persist: true,
          });
        }
      } catch (error) {
        enqueueSnackbar('Failed to save due to an error.', { variant: 'error', persist: true });
      }
    });
  };

  const accountSettingsSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  const defaultValues = {
    email: userApi.webhook?.notification_email || '',
  };

  const methods = useForm({
    resolver: yupResolver(accountSettingsSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await updateUserSettings(
        {
          api: {
            token: apiKey,
            updated_at: new Date(),
            webhook: {
              notification_email: data.email,
            },
          },
        },
        { api: true }
      );

      if (response.success) {
        enqueueSnackbar('Notification email updated successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(response.message || 'Failed to update notification email', {
          variant: 'error',
          persist: true,
        });
      }
    } catch (error) {
      enqueueSnackbar('Failed to update notification email', { variant: 'error', persist: true });
    }
  });

  return (
    <Stack spacing={3}>
      {/* Account API Key Section */}
      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Account API Key
          </Typography>
          <FormProvider methods={methods}>
            <Stack spacing={2}>
              <RHFTextField
                name="apiKey"
                label="API Key"
                value={apiKey}
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Copy API key">
                          <Button
                            onClick={handleCopyApiKey}
                            startIcon={<Iconify icon="uil:copy" />}
                          >
                            Copy
                          </Button>
                        </Tooltip>
                        <Tooltip title="Regenerate API key">
                          <LoadingButton
                            color="primary"
                            variant="contained"
                            onClick={handleRegenerateApiKey}
                            loadingPosition="start"
                            loading={isRegeneratingApiKey}
                            startIcon={<Iconify icon="solar:refresh-linear" />}
                          >
                            Reset API Key
                          </LoadingButton>
                        </Tooltip>
                      </Stack>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="body2" color="text.secondary">
                This API key is used to authenticate your account with external services. Keep it
                secure and don&apos;t share it publicly.
              </Typography>
            </Stack>
          </FormProvider>
        </Box>
      </Card>

      {/* Disconnect Notification Email Section */}
      <Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Disconnect Notification Email
          </Typography>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2}>
              <RHFTextField
                name="email"
                label="Disconnect Notification Email"
                placeholder="Enter email address"
                helperText="This email will receive notifications when your account is disconnected"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  loading={isSubmitting}
                  startIcon={<Iconify icon="solar:disk-linear" />}
                >
                  Save
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Card>
    </Stack>
  );
};
