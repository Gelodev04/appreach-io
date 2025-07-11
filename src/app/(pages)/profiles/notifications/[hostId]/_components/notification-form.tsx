'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { hosts } from '@prisma/client';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { updateHostNotification } from 'src/services/db/hosts';
import * as Yup from 'yup';

export default function NotificationForm({ currentItem }: { currentItem: hosts }) {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    host: Yup.string().required('Host name is required'),
    notificationAddresses: Yup.string(),
    slackChannelId: Yup.string(),
  });

  const defaultValues = {
    host: currentItem?.host ?? '',
    notificationAddresses: currentItem.notifications?.emailAddressArray
      ? currentItem.notifications?.emailAddressArray?.map((item) => item).join('\n')
      : '',
    slackChannelId: currentItem.notifications?.slackChannel ?? '',
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
    const response = await updateHostNotification(currentItem.id, data);
    if (!response.success) {
      enqueueSnackbar(response.message, { variant: 'error', persist: true });
    } else {
      enqueueSnackbar('Update success!');
      router.push(paths.profiles.root);
    }
  });

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

              <RHFTextField
                name="slackChannelId"
                label="Slack Channel ID"
                minRows={3}
                maxRows={5}
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
              Edit notifications settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Edit your notifications settings.
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
