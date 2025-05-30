import { useMemo } from 'react';
import Iconify from 'src/components/iconify/iconify';

import { useIsTrialExpired } from 'src/hooks/use-is-trial-expired';
import { useOnboardingStatus } from 'src/hooks/use-onboarding-status';
import { usePlanPermissions } from 'src/hooks/use-plan-permission-features';
import { paths } from 'src/routes/paths';

export function useNavData() {
  const isTrialExpired = useIsTrialExpired();
  const { completedOn, hydrated } = useOnboardingStatus();

  const { otherTools, hydrated: planPermissionsHydrated } = usePlanPermissions();

  const disableAccess = isTrialExpired || completedOn === null;

  const data = useMemo(() => {
    if (!hydrated || !planPermissionsHydrated) return [];

    const base: { subheader: string; items: any[] }[] = [
      {
        subheader: 'Unified Reporting',
        items: [
          {
            title: 'Dashboard',
            path: paths.dashboard.root,
            icon: <Iconify icon="codicon:graph" />,
            disabled: disableAccess,
          },
          {
            title: 'Manual Events',
            path: paths.manualEvents.root,
            icon: <Iconify icon="material-symbols:view-timeline-outline-rounded" />,
            disabled: disableAccess,
          },
          {
            title: 'Attribute Uploads',
            path: paths.attributesUpload.root,
            icon: <Iconify icon="material-symbols:upload-2-outline-rounded" />,
            disabled: disableAccess,
          },
          {
            title: 'Event Senders',
            path: paths.eventSenders.root,
            icon: <Iconify icon="mdi:email-arrow-right-outline" />,
            disabled: disableAccess,
          },
          {
            title: 'Account Profiles',
            path: paths.settings.root,
            icon: <Iconify icon="bx:server" />,
            disabled: disableAccess,
          },
          // {
          //   title: 'LinkedIn Events',
          //   path: paths.senders.linkedin,
          //   icon: <Iconify icon="bxl:linkedin" />,
          //   disabled: disableAccess,
          // },

          // {
          //   title: 'Hubspot',
          //   path: paths.hubspot.root,
          //   icon: <Iconify icon="simple-icons:hubspot" />,
          //   disabled: disableAccess,
          // },

          // {
          //   title: 'Logout',
          //   path: paths.auth.logout,
          //   icon: <Iconify icon="hugeicons:logout-04" />,
          //   disabled: false,
          // },
        ],
      },
      {
        subheader: 'Seed Accounts',
        items: [
          {
            title: 'Seed List',
            path: paths.seed.root,
            icon: <Iconify icon="pepicons-pop:seedling" />,
            disabled: disableAccess,
          },
          {
            title: 'Verified Senders',
            path: paths.senders.verifiedSenders,
            icon: <Iconify icon="hugeicons:address-book" />,
            disabled: disableAccess,
          },
        ],
      },
      {
        subheader: 'Settings',
        items: [
          {
            title: 'Webhooks',
            path: paths.webhooks.root,
            icon: <Iconify icon="material-symbols:webhook-rounded" />,
            disabled: disableAccess,
          },
          {
            title: 'Billing',
            path: paths.checkout.root,
            icon: <Iconify icon="flowbite:file-invoice-outline" />,
            disabled: completedOn === null,
          },
          {
            title: 'Need Support?',
            path: paths.support.link,
            icon: <Iconify icon="mdi:slack" />,
          },

          // {
          //   title: 'Smartlead',
          //   path: paths.senders.smartlead,
          //   icon: <Iconify icon="material-symbols:graph-1" />,
          //   disabled: disableAccess,
          // },

          // {
          //   title: 'Instantly',
          //   path: paths.senders.instantly,
          //   icon: <Iconify icon="material-symbols:bolt-outline-rounded" />,
          //   disabled: disableAccess,
          // },
          // {
          //   title: 'Email Bison',
          //   path: paths.senders.emailBison,
          //   icon: <Iconify icon="material-symbols:outgoing-mail-outline-rounded" />,
          //   disabled: disableAccess,
          // },
          // {
          //   title: 'Prosp',
          //   path: paths.senders.prosp,
          //   icon: <Iconify icon="uil:robot" />,
          //   disabled: disableAccess,
          // },
          // {
          //   title: 'HeyReach',
          //   path: paths.senders.heyReach,
          //   icon: <Iconify icon="material-symbols:waving-hand-outline-rounded" />,
          //   disabled: disableAccess,
          // },
        ],
      },
    ];

    if (otherTools) {
      base.push({
        subheader: 'Other Tools',
        items: [
          {
            title: 'Email Validator',
            path: paths.emailValidator.root,
            icon: <Iconify icon="material-symbols:mark-email-read-outline" />,
            disabled: disableAccess,
          },
        ],
      });
    }

    return base;
  }, [disableAccess, completedOn, otherTools, hydrated, planPermissionsHydrated]);

  return data;
}
