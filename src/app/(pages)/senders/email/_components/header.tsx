'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export default function Header() {
  return (
    <CustomBreadcrumbs
      heading="Verify a new sender email"
      links={[
        {
          name: 'Sender Addresses',
          href: paths.senders.root,
        },
        { name: 'Verify new email' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
}
