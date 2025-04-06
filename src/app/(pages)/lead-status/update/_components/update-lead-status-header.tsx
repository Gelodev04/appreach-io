'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export const UpdateLeadStatusHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Update Lead Status"
      links={[
        {
          name: 'Set Lead Status',
          href: paths.leadStatus.root,
        },
        { name: 'Update Lead Status' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
};
