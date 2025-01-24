'use client';

import { Button, Stack } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const SmartleadHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="SmartLead Accounts"
      links={[{ name: 'SmartLead Setup' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Button variant="contained">Configure Integration</Button>
          <Button variant="contained" color="primary">
            Sync Accounts
          </Button>
        </Stack>
      }
    />
  );
};
