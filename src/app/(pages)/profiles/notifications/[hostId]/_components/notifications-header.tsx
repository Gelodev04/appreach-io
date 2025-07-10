'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export const NotificationsHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Edit notification settings"
      links={[
        {
          name: 'Sender Profiles',
          href: paths.profiles.root,
        },
        { name: 'Edit notification settings' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
};
