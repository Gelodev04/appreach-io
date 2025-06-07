'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const MissingAttributesHeader = () => {
  return (
    <CustomBreadcrumbs heading="Missing Attributes" links={[{ name: 'Missing Attributes' }]} />
  );
};
