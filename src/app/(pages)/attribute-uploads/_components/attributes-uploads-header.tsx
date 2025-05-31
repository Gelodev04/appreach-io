'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

export const AttributesUploadsHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Attribute Uploads"
      links={[{ name: 'Attribute Uploads' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Link href={paths.attributesUpload.new}>
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
