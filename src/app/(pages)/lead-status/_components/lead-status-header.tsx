'use client';

import { Button, Stack } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const LeadStatusHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Set Lead Status"
      links={[{ name: 'Set Lead Status' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Button variant="contained">Settings</Button>
          <Button variant="contained" color="primary">
            Sync Accounts
          </Button>
        </Stack>
      }
    />
  );
};
