import { useMemo } from 'react';
import Iconify from 'src/components/iconify/iconify';

import { paths } from 'src/routes/paths';

export const useSharableNavData = () => {
  const data = useMemo(() => {
    const base: { subheader: string; items: any[] }[] = [
      {
        subheader: 'Unified Reporting',
        items: [
          {
            title: 'Dashboard',
            path: paths.auth.login,
            icon: <Iconify icon="codicon:graph" />,
            disabled: false,
          },
          {
            title: 'Set Lead Status',
            path: paths.auth.login,
            icon: <Iconify icon="material-symbols:view-timeline-outline-rounded" />,
            disabled: false,
          },
          {
            title: 'Attributes Upload',
            path: paths.auth.login,
            icon: <Iconify icon="material-symbols:upload-2-outline-rounded" />,
            disabled: false,
          },
          {
            title: 'Event Senders',
            path: paths.auth.login,
            icon: <Iconify icon="mdi:email-arrow-right-outline" />,
            disabled: false,
          },
        ],
      },
      {
        subheader: 'Seed Accounts',
        items: [
          {
            title: 'Seed List',
            path: paths.auth.login,
            icon: <Iconify icon="pepicons-pop:seedling" />,
            disabled: false,
          },
          {
            title: 'Verified Senders',
            path: paths.auth.login,
            icon: <Iconify icon="hugeicons:address-book" />,
            disabled: false,
          },
        ],
      },
      {
        subheader: 'Settings',
        items: [
          {
            title: 'Account Profiles',
            path: paths.auth.login,
            icon: <Iconify icon="bx:server" />,
            disabled: false,
          },

          {
            title: 'Webhooks',
            path: paths.auth.login,
            icon: <Iconify icon="material-symbols:webhook-rounded" />,
            disabled: false,
          },
          {
            title: 'Billing',
            path: paths.auth.login,
            icon: <Iconify icon="flowbite:file-invoice-outline" />,
            disabled: false,
          },
        ],
      },
    ];

    return base;
  }, []);

  return data;
};
