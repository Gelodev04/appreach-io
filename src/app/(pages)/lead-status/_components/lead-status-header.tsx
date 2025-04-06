'use client';

import { Button, Link, Stack } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export const LeadStatusHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Set Lead Status"
      links={[{ name: 'Set Lead Status' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Link component={RouterLink} href={paths.leadStatus.update} variant="subtitle2">
            <Button variant="contained" color="primary">
              Update Lead Status
            </Button>
          </Link>
        </Stack>
      }
    />
  );
};
