'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const WebhooksHeader = () => {
  return <CustomBreadcrumbs heading="Webhooks" links={[{ name: 'Webhooks' }]} />;
};
