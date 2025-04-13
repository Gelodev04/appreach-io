'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const EmailEventsHeader = () => {
  return <CustomBreadcrumbs heading="Email Events" links={[{ name: 'Email Events' }]} />;
};
