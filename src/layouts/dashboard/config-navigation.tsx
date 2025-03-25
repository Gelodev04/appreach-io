import { useMemo } from 'react';
import Iconify from 'src/components/iconify/iconify';

import { useIsTrialExpired } from 'src/hooks/use-is-trial-expired';
import { paths } from 'src/routes/paths';

export function useNavData() {
  const isTrialExpired = useIsTrialExpired();
  const data = useMemo(
    () => [
      {
        subheader: 'Settings',
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: <Iconify icon="codicon:graph" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Account Profiles',
            path: paths.settings.root,
            icon: <Iconify icon="bx:server" />,
            disabled: isTrialExpired,
          },

          {
            title: 'Seeds',
            path: paths.seed.root,
            icon: <Iconify icon="pepicons-pop:seedling" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Email Validator',
            path: paths.emailValidator.root,
            icon: <Iconify icon="material-symbols:mark-email-read-outline" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Attributes Upload',
            path: paths.attributesUpload.root,
            icon: <Iconify icon="material-symbols:upload-2-outline-rounded" />,
            disabled: isTrialExpired,
          },

          {
            title: 'Webhooks',
            path: paths.webhooks.root,
            icon: <Iconify icon="material-symbols:webhook-rounded" />,
            disabled: isTrialExpired,
          },
          // {
          //   title: 'Hubspot',
          //   path: paths.hubspot.root,
          //   icon: <Iconify icon="simple-icons:hubspot" />,
          //   disabled: isTrialExpired,
          // },
          {
            title: 'Subscription',
            path: paths.checkout.root,
            icon: <Iconify icon="flowbite:file-invoice-outline" />,
            disabled: false,
          },
          // {
          //   title: 'Logout',
          //   path: paths.auth.logout,
          //   icon: <Iconify icon="hugeicons:logout-04" />,
          //   disabled: false,
          // },
        ],
      },
      {
        subheader: 'Senders',
        items: [
          {
            title: 'Non-API',
            path: paths.senders.nonAPI,
            icon: <Iconify icon="hugeicons:address-book" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Smartlead',
            path: paths.senders.smartlead,
            icon: <Iconify icon="material-symbols:graph-1" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Instantly',
            path: paths.senders.instantly,
            icon: <Iconify icon="material-symbols:bolt-outline-rounded" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Email Bison',
            path: paths.senders.emailBison,
            icon: <Iconify icon="material-symbols:outgoing-mail-outline-rounded" />,
            disabled: isTrialExpired,
          },
          {
            title: 'Prosp',
            path: paths.senders.prosp,
            icon: <Iconify icon="uil:robot" />,
            disabled: isTrialExpired,
          },
          {
            title: 'HeyReach',
            path: paths.senders.heyReach,
            icon: <Iconify icon="material-symbols:waving-hand-outline-rounded" />,
            disabled: isTrialExpired,
          },
        ],
      },
    ],
    [isTrialExpired]
  );

  return data;
}
