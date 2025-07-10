import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { hosts } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { SenderProfileTabs } from 'src/app/(pages)/profiles/seeds/[hostId]/_components';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { defaultEngagementSettings } from 'src/constants';
import { useResponsive } from 'src/hooks/use-responsive';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { createHost, updateHostData } from 'src/services/db/hosts';
import { useSenderAddressTabStore } from 'src/store/sender-address-tab';
import { HostProps } from 'src/types/host';
import * as Yup from 'yup';
import { useDefaultEngagementSettings } from './hooks';

export default function HostNewEditForm({ currentItem, planPermissions, emails }: HostProps) {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');
  const setTab = useSenderAddressTabStore((state) => state.setTab);
  const updatedHostItem = useDefaultEngagementSettings(currentItem);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const newHostSchema = Yup.object().shape({
    host: Yup.string().required('Host name is required'),
    externalSenderAddresses: Yup.string(),
    scrollMessage: Yup.number().required('This field cannot be empty.'),
    markImportant: Yup.number().required('This field cannot be empty.'),
    removeSpam: Yup.number().required('This field cannot be empty.'),
    movePrimary: Yup.number().required('This field cannot be empty.'),
    clickLink: Yup.number().required('This field cannot be empty.'),
    replyMessage: Yup.number().required('This field cannot be empty.'),
    linksToClick: Yup.string(),
    linksNotToClick: Yup.string(),
    filterId: Yup.string().when(
      ['$planPermissions.planPermissionFeatures.replyMessage', '$updatedHostItem'],
      {
        is: (replyMessage: boolean, item: hosts) => replyMessage && !!item,
        then: (schema) => schema.required('Filter ID is required.'),
      }
    ),
    disableFilterId: Yup.boolean(),
    replyPrompt: Yup.string().when('$planPermissions.planPermissionFeatures.replyMessage', {
      is: true,
      then: (schema) => schema.required('Reply prompt is required'),
    }),
    useEventSenders: Yup.boolean(),
  });

  const getEngagementValue = (item: string) => {
    if (
      !planPermissions.planPermissionFeatures[
        item as keyof typeof planPermissions.planPermissionFeatures
      ]
    )
      return 0;
    if (currentItem && updatedHostItem?.engagementSettings)
      return (
        (updatedHostItem?.engagementSettings[
          item as keyof typeof updatedHostItem.engagementSettings
        ] as number) ?? 0
      );
    return 50;
  };

  const defaultValues = {
    host: updatedHostItem?.host ?? '',
    externalSenderAddresses: emails ? emails?.map((item) => item.email).join('\n') : '',
    scrollMessage: getEngagementValue('scrollMessage'),
    markImportant: getEngagementValue('markImportant'),
    removeSpam: getEngagementValue('removeSpam'),
    movePrimary: getEngagementValue('movePrimary'),
    clickLink: getEngagementValue('clickLink'),
    replyMessage: getEngagementValue('replyMessage'),
    linksToClick: updatedHostItem?.engagementSettings?.linksToClick
      ? updatedHostItem.engagementSettings?.linksToClick.join(', ')
      : '',
    linksNotToClick: updatedHostItem?.engagementSettings?.linksNotToClick
      ? updatedHostItem.engagementSettings?.linksNotToClick.join(', ')
      : '',
    filterId: updatedHostItem?.engagementSettings?.filterId
      ? updatedHostItem.engagementSettings.filterId
      : '',
    disableFilterId: updatedHostItem?.engagementSettings?.disableFilterId ?? false,
    replyPrompt:
      updatedHostItem?.engagementSettings?.replyPrompt ??
      defaultEngagementSettings.engagementSettings.replyPrompt,

    useEventSenders: updatedHostItem?.engagementSettings?.useEventSenders ?? true,
  };

  const methods = useForm({
    resolver: yupResolver(newHostSchema),
    defaultValues,
    context: { planPermissions, updatedHostItem },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(
    async (data) => {
      // If no validation errors, proceed
      closeSnackbar();
      try {
        if (currentItem) {
          const response = await updateHostData(currentItem?.id, data);
          if (!response.success) {
            enqueueSnackbar(response.message, { variant: 'error', persist: true });
          } else {
            enqueueSnackbar('Update success!');
            router.push(paths.profiles.root);
          }
        } else {
          const response = await createHost(data);
          if (!response.success) {
            enqueueSnackbar(response.message, { variant: 'error', persist: true });
          } else {
            enqueueSnackbar('Create success!');
            router.push(paths.profiles.root);
          }
        }
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error', persist: true });
      }
    },
    (errors) => {
      const errorKeys = Object.keys(errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];

        const fieldToTabMap = {
          host: 'sender_engagement',
          timezone: 'sender_engagement',
          linksToClick: 'sender_engagement',
          linksNotToClick: 'sender_engagement',
          filterId: 'sender_replying',
          replyPrompt: 'sender_replying',
        };

        const tabToSwitch = fieldToTabMap[firstErrorKey as keyof typeof fieldToTabMap];
        if (tabToSwitch) {
          setTab(tabToSwitch); // Switch to the tab where the error is
        }
      }
    }
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                }}
              >
                <RHFTextField
                  name="host"
                  label="Sender profile name"
                  placeholder="outreachmagic"
                  disabled={!!currentItem}
                />
              </Box>
              {currentItem && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <RHFTextField
                    name="externalSenderAddresses"
                    label="Sender addresses"
                    minRows={3}
                    maxRows={5}
                    disabled
                    multiline
                    InputLabelProps={{ shrink: true }}
                  />
                  <Link
                    href={`${paths.senders.verifiedSenders}?hostId=${currentItem.id}`}
                    style={{ display: 'flex', textDecoration: 'none' }}
                  >
                    <Button color="primary" variant="outlined">
                      Edit
                    </Button>
                  </Link>
                </Box>
              )}
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
              {currentItem ? 'Edit seed settings' : 'Add sender profile'}
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
