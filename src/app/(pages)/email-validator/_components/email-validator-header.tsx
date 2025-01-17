'use client';
import { Button, Stack } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';

export const EmailValidatorHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Email Validator"
      links={[{ name: 'Email Validator' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Upload CSV File
          </Button>
        </Stack>
      }
    />
  );
};
