'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export const AddEventsHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Manually Add Events"
      links={[
        {
          name: 'All Events',
          href: paths.manualEvents.root,
        },
        { name: 'Add Event' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
};
