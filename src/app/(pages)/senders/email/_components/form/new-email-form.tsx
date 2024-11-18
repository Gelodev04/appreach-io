'use client';

import { LoadingButton } from '@mui/lab';
import { Box, Card, MenuItem, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

type SenderProfilesType = {
  profile: string;
  id: string;
};

type CreateSendersEmailFormType = {
  senderProfiles: SenderProfilesType[];
};

export default function CreateSendersEmailForm({ senderProfiles }: CreateSendersEmailFormType) {
  const methods = useForm({
    defaultValues: {},
  });

  console.log({ senderProfiles });

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log({ data });
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
              <RHFSelect name="profile" label="Sender Profile" placeholder="Sender Profile">
                {senderProfiles?.map((senderProfile) => (
                  <MenuItem id={senderProfile.id} value={senderProfile.profile}>
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
              variant="contained"
              color="primary"
              loading={false}
              sx={{ width: 200 }}
            >
              Add sender address
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
