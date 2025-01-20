'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

export const EmailValidatorHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Email Validator"
      links={[{ name: 'Email Validator' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Link href={paths.emailValidator.new}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Upload CSV File
            </Button>
          </Link>
        </Stack>
      }
    />
  );
};
