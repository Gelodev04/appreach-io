import { useMemo } from 'react';
import Iconify from 'src/components/iconify/iconify';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

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
            title: 'Settings',
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
          // {
          //   title: 'Upload attributes',
          //   path: paths.dashboard.csvUpload.root,
          //   icon: <Iconify icon="mage:file-upload-fill" />,
          // },
          {
            title: 'Logout',
            path: paths.dashboard.logout.root,
            icon: <Iconify icon="hugeicons:logout-04" />,
          },
        ],
      },
    ],
    []
  );

  return data;
}
