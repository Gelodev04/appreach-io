'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, MenuItem, Stack, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { useTransition } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  createSenderAddress,
  getSenderAddressByHostId,
  getSenderByEmail,
} from 'src/services/db/sender-addresses';
import { getEmailDomain } from 'src/utils';
import { enqueueSnackbar } from 'notistack';
import { sendSenderVerification } from 'src/services/webhook/sender-emails';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { getVerifiedDomain } from 'src/services/db/sender-domains';
import { incrementSenderAddressesUsed } from 'src/services/db/user-settings';
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
  email: Yup.string().email('Invalid email format').required('Email is required'),
  hostId: Yup.string().required('Profile is required'),
});

export default function CreateSendersEmailForm({ senderProfiles }: CreateSendersEmailFormType) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      hostId: '',
    },
  });

  const checkEmailExistenceInSenderAddresses = async (email: string) => {
    const isSenderEmailExist = await getSenderByEmail(email);

    if (isSenderEmailExist) {
      enqueueSnackbar(
        <Typography width={300} p={1}>
          Sender address already in use with another sender profile. Please contact support.
        </Typography>,
        { variant: 'info' }
      );
      return true;
    }

    return false;
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      startTransition(async () => {
        if (await checkEmailExistenceInSenderAddresses(data.email)) return undefined;

        const inputEmailDomain = getEmailDomain(data.email);
        const userHostIds = senderProfiles.map((senderProfile) => senderProfile.id);
        if (!inputEmailDomain) {
          enqueueSnackbar(
            <Typography width={300} p={1}>
              Domain not found.
            </Typography>,
            { variant: 'error' }
          );
        }
        const domain = await getVerifiedDomain({
          domain: inputEmailDomain,
          verified: true,
          hostId: { in: userHostIds },
        });

        if (!domain) {
          const newSenderAddress = await createSenderAddress({
            email: data.email,
            hostId: data.hostId,
            isVerified: false,
          });
          const result = await sendSenderVerification({ type: 'email' });
          if (result) {
            enqueueSnackbar({
              message: (
                <VerificationEmailMessage
                  message={`A verification email has been sent to ${newSenderAddress.email}, click the confirmation link to verify it.`}
                />
              ),
              variant: 'success',
              persist: true,
              onClose: (e) => {
                e?.preventDefault();
                methods.reset();
                router.push(`${paths.senders.root}?tableIndex=0`);
              },
            });
          }
        } else {
          const newVerifiedSenderAddress = await createSenderAddress({
            email: data.email,
            hostId: data.hostId,
            isVerified: true,
          });
          if (newVerifiedSenderAddress.id) {
            enqueueSnackbar('Your email has successfully verified via the domain verification', {
              variant: 'success',
              style: { maxWidth: 400 },
              onClose: () => {
                router.push(`${paths.senders.root}?tableIndex=0`);
              },
            });
          }
        }
        await incrementSenderAddressesUsed();
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
              <RHFTextField name="email" label="Email Address" placeholder="Email Address" />
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
              Verify a new sender email
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
              Enter the address you will be sending emails from.
            </Typography>
            <LoadingButton
              type="submit"
              color="primary"
              variant="contained"
              sx={{ width: 200 }}
              loading={isPending}
              loadingPosition="start"
            >
              {isPending ? ' Email Verification...' : ' Add sender address'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
