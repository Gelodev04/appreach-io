import { Button, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { NavSectionVertical } from 'src/components/nav-section';
import Scrollbar from 'src/components/scrollbar';

import { useIsTrialExpired } from 'src/hooks/use-is-trial-expired';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useOnboardingStatus } from 'src/hooks/use-onboarding-status';
import { usePlanPermissions } from 'src/hooks/use-plan-permission-features';
import { useResponsive } from 'src/hooks/use-responsive';
import { usePathname } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { TourDialog, TourGuide } from 'src/components/tour';
import { useTourDialogStore } from 'src/store/tour-dialog';
import NavBottom from '../common/nav-bottom';
import NavToggleButton from '../common/nav-toggle-button';
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useMockedUser();
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useSession();
  const lgUp = useResponsive('up', 'lg');
  const navData = useNavData();
  const muiTheme = useTheme();
  const isTrialExpired = useIsTrialExpired();
  const { rawCompletedOn, hydrated, isLoading } = useOnboardingStatus();
  const { otherTools, hydrated: planPermissionsHydrated } = usePlanPermissions();
  const { start } = useTourDialogStore((state) => state);

  const shouldSkip = !hydrated || !planPermissionsHydrated || isLoading;

  useEffect(() => {
    if (shouldSkip) return;

    const isOn = {
      onboarding: pathname.includes('onboarding'),
      billing: pathname.includes('billing'),
      emailValidator: pathname.includes('email-validator'),
    };

    // Block all access until onboarding is complete
    if (rawCompletedOn === null && !isOn.onboarding) {
      router.push(paths.onboarding.root);
      return;
    }

    // Redirect to billing if trial expired after onboarding
    if (isTrialExpired && !isOn.billing) {
      router.push(paths.checkout.root);
      console.log('2nd redirect');
      return;
    }

    // Block access to email-validator if user has no access
    if (!otherTools && isOn.emailValidator) {
      router.push(paths.dashboard.root);
      console.log('3rd redirect');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSkip, rawCompletedOn, pathname, isTrialExpired, otherTools]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  console.log({ allowed: data?.user?.email === 'spencer@outreachmagic.io' });

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />
      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />

      {data?.user?.email === 'spencer@outreachmagic.io' && (
        <div
          style={{
            margin: '1rem',
          }}
        >
          <TourDialog />
        </div>
      )}
      {start && <TourGuide />}

      <Box sx={{ height: '50px' }} />
      <Box sx={{ marginTop: 'auto' }}>
        <NavBottom />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            margin: '1rem',
          }}
        >
          <Box
            sx={{
              borderRadius: '8px',
              background: alpha(muiTheme.palette.primary.main, 0.04),
              borderBottom: '1px solid',
              borderColor: alpha(muiTheme.palette.primary.main, 0.1),
              display: 'flex',
              flexDirection: 'row',
              padding: 1,
              color: '#637381',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.2, flexDirection: 'column' }}>
              <Typography variant="body2">Signed in as</Typography>
              <Typography variant="subtitle1">{data?.user?.email}</Typography>
            </Box>
          </Box>
          {/* <TourDialog /> */}
          <Button
            color="primary"
            variant="contained"
            onClick={() => router.push(paths.auth.logout)}
            startIcon={<Iconify icon="hugeicons:logout-04" />}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
