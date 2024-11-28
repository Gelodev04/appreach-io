'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

function DomainHeader() {
  return (
    <CustomBreadcrumbs
      heading="Verify a new domain name"
      links={[
        {
          name: 'Domain Name',
          href: paths.senders.root,
        },
        { name: 'Verify new domain' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
}

export default DomainHeader;
