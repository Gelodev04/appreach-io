import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Divider, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { hosts } from '@prisma/client';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { updateHostSmartlead } from 'src/services/db/hosts';
import * as Yup from 'yup';

export default function HostSmartleadForm({ currentItem }: { currentItem: hosts }) {
  const { copy } = useCopyToClipboard();
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    host: Yup.string().required('Host name is required'),
    notificationAddresses: Yup.string().required('Notification address is required'),
    apiKey: Yup.string().required('API key is required'),
    webhook: Yup.string().required('required'),
  });

  const defaultValues = {
    host: currentItem?.host ?? '',
    notificationAddresses: currentItem.smartlead?.notificationAddresses
      ? currentItem.smartlead?.notificationAddresses?.map((item) => item).join('\n')
      : '',
    apiKey: currentItem.smartlead?.apiKey ?? '',
    webhook: currentItem.smartlead?.webhook ?? '',
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
    const response = await updateHostSmartlead(currentItem.id, data);

    if (!response.success) {
      enqueueSnackbar(response.message, { variant: 'error', persist: true });
    } else {
      enqueueSnackbar('Update success!');
      router.push(paths.settings.root);
    }
  });

  const handleCopyWebhook = () => {
    if (!currentItem.smartlead?.webhook) {
      enqueueSnackbar('Webhook is empty', { variant: 'error', autoHideDuration: 1500 });
      return;
    }
    copy(currentItem.smartlead?.webhook);
    enqueueSnackbar('Copied to clipboard', { autoHideDuration: 1500 });
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              <RHFTextField name="host" label="Host name" placeholder="outreachmagic" disabled />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <RHFTextField
                  name="notificationAddresses"
                  label="Notification addresses"
                  minRows={3}
                  maxRows={5}
                  multiline
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <RHFTextField name="apiKey" label="Smartlead API Key" minRows={3} maxRows={5} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <RHFTextField
                  name="webhook"
                  label="Smartlead Webhook"
                  minRows={3}
                  maxRows={5}
                  disabled
                />

                <Button color="primary" variant="outlined" onClick={handleCopyWebhook}>
                  <Iconify icon="uil:copy" />
                </Button>
              </Box>
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
              Edit smartlead settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Edit your smartlead settings.
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
}
