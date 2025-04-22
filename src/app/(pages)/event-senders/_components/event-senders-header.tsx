'use client';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export const EventSendersHeader = () => {
  return <CustomBreadcrumbs heading="Event Senders" links={[{ name: 'Event Senders' }]} />;
};
