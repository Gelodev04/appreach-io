import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify/iconify';

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
            title: 'Hosts',
            path: paths.dashboard.host.root,
            icon: <Iconify icon="bx:server" />,
          },
          {
            title: 'Seeds',
            path: paths.dashboard.seed.root,
            icon: <Iconify icon="pepicons-pop:seedling" />,
          },
          // {
          //   title: 'Emails',
          //   path: paths.dashboard.emails.root,
          //   icon: <Iconify icon="entypo:email" />,
          // },
          {
            title: 'Upload attributes',
            path: paths.dashboard.csvUpload.root,
            icon: <Iconify icon="mage:file-upload-fill" />,
          },
        ],
      },
    ],
    []
  );

  return data;
}
