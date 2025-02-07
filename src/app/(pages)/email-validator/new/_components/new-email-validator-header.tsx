'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

export const NewEmailValidatorHeader = () => {
  return (
    <CustomBreadcrumbs
      heading="Upload CSV List"
      links={[
        {
          name: 'Email Validator',
          href: paths.emailValidator.root,
        },
        { name: 'Upload csv list' },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
};
