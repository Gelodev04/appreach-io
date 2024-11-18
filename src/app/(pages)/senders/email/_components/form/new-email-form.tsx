'use client';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';

export default function CreateSendersEmailForm() {
  const methods = useForm({
    defaultValues: {},
  });

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

              <RHFAutocomplete
                name="profile"
                label="Sender Profile"
                placeholder="Sender Profile"
                options={[]}
              />
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
