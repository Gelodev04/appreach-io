'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export const NewAttributesUploadsHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Upload CSV List"
      links={[
        {
          name: 'Attributes Uploads',
          href: paths.attributesUpload.root,
        },
        { name: 'Upload csv list' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
};
