import { useMemo } from 'react';
import Iconify from 'src/components/iconify/iconify';
import { paths } from 'src/routes/paths';

export function useNavData() {
  const data = useMemo(
    () => [
      {
        subheader: 'Settings',
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: <Iconify icon="codicon:graph" />,
          },
          {
            title: 'Sender Addresses',
            path: paths.senders.root,
            icon: <Iconify icon="hugeicons:address-book" />,
          },
          {
            title: 'Sender Profiles',
            path: paths.settings.root,
            icon: <Iconify icon="bx:server" />,
          },
          {
            title: 'Seeds',
            path: paths.seed.root,
            icon: <Iconify icon="pepicons-pop:seedling" />,
          },
          // {
          //   title: 'Emails',
          //   path: paths.dashboard.emails.root,
          //   icon: <Iconify icon="entypo:email" />,
          // },
          {
            title: 'Subscription',
            path: paths.checkout.root,
            icon: <Iconify icon="flowbite:file-invoice-outline" />,
          },
          {
            title: 'Logout',
            path: paths.auth.logout,
            icon: <Iconify icon="hugeicons:logout-04" />,
          },
        ],
      },
    ],
    []
  );

  return data;
}
