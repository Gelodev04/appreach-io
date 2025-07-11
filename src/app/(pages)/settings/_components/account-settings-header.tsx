'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const AccountSettingsHeader = () => {
  return <CustomBreadcrumbs heading="Account Settings" links={[{ name: 'Account Settings' }]} />;
};
