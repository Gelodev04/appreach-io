'use client';

import { Button, Link, Stack } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export const ManualEventsHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Manual Events"
      links={[{ name: 'Manual Events' }]}
      action={
        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
          <Link component={RouterLink} href={paths.manualEvents.update} variant="subtitle2">
            <Button variant="contained" color="primary">
              Add New Event
            </Button>
          </Link>
        </Stack>
      }
    />
  );
};
