'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, MenuItem, Stack, Typography } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { useTransition } from 'react';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/navigation';

type SenderProfilesType = {
  profile: string;
  id: string;
};

type CreateSendersEmailFormType = {
  senderProfiles: SenderProfilesType[];
  unverifiedSender: {
    value: string;
    hostId: string;
  };
};

type FormData = Yup.InferType<typeof validationSchema>;

// Define the validation schema
export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  hostId: Yup.string().required('Profile is required'),
});

export default function EditSendersEmailForm({
  senderProfiles,
  unverifiedSender,
}: CreateSendersEmailFormType) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: unverifiedSender.value,
      hostId: unverifiedSender.hostId,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    try {
      console.log({ data });
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
              {isPending ? ' Email Verification...' : ' Verify sender'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
