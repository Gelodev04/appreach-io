'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, MenuItem, Stack, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { useTransition } from 'react';
import { LoadingButton } from '@mui/lab';
import { createUnverifiedSenders, getVerifiedDomain } from 'src/services/db/verified-domains';
import { enqueueSnackbar } from 'notistack';
import { requestForEmailVerification } from 'src/services/webhook/email-verification';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import VerificationEmailMessage from '../verification-email-message';

type SenderProfilesType = {
  profile: string;
  id: string;
};

type CreateSendersEmailFormType = {
  senderProfiles: SenderProfilesType[];
};

type FormData = Yup.InferType<typeof validationSchema>;

// Define the validation schema
export const validationSchema = Yup.object().shape({
  domain: Yup.string()
    .required('Domain is required')
    .matches(
      /^(?!.*\.\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      'Domain must be a valid format with a dot'
    ),
  hostId: Yup.string().required('Profile is required'),
});

export default function CreateDomainForm({ senderProfiles }: CreateSendersEmailFormType) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      domain: '',
      hostId: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      startTransition(async () => {
        // const inputEmailDomain = getEmailDomain(data.domain);
        const userHostIds = senderProfiles.map((senderProfile) => senderProfile.id);
        /*  if (!inputEmailDomain) {
          enqueueSnackbar('Domain not found.', { variant: 'error' });
        } */
        const domain = await getVerifiedDomain({
          domain: data.domain,
          hostId: { in: userHostIds },
        });

        if (!domain) {
          const unverifiedDomain = await createUnverifiedSenders(
            data.domain,
            data.hostId,
            'domain'
          );
          const result = await requestForEmailVerification(unverifiedDomain);
          if (result) {
            enqueueSnackbar({
              message: <VerificationEmailMessage />,
              variant: 'success',
              persist: true,
              onClose: (e) => {
                e?.preventDefault();
                methods.reset();
                router.push(`${paths.senders.root}?tableIndex=1`);
              },
            });
          }
        }
        // TODO: Confirm to Spencer if domain found do we need to directly create in verifiedDomain?
        /*  else {
          const newVerifiedEmail = await createVerifiedDomains(data.domain, data.hostId);
          if (newVerifiedEmail.id) {
            enqueueSnackbar('Your email has successfully verified via the domain verification', {
              variant: 'success',
              onClose: () => {
                router.push(paths.senders.root);
              },
            });
          }
        } */
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Grid container alignItems="center" md={12}>
        <Grid xs={12} md={8}>
          <Card sx={{ bgcolor: 'background.paper', padding: 3 }}>
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="domain" label="Domain Name" placeholder="Domain Name" />
              <RHFSelect name="hostId" label="Sender Profile" placeholder="Sender Profile">
                {senderProfiles?.map((senderProfile) => (
                  <MenuItem key={senderProfile.id} value={senderProfile.id}>
                    {senderProfile.profile}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Stack padding={3}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Verify a new domain name
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Enter the domain name you will be sending emails from.
            </Typography>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              sx={{ width: 200 }}
              loading={isPending}
              loadingPosition="start"
            >
              {isPending ? ' Email Verification...' : ' Add sender domain'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
