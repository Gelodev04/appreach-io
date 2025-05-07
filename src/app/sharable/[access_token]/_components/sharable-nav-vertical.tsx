import { Button, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { NavSectionVertical } from 'src/components/nav-section';
import Scrollbar from 'src/components/scrollbar';

import { useResponsive } from 'src/hooks/use-responsive';
import NavBottom from 'src/layouts/common/nav-bottom';
import NavToggleButton from 'src/layouts/common/nav-toggle-button';
import { NAV } from 'src/layouts/config-layout';
import { usePathname } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSharableNavData } from '../_hooks/useSharableNavData';

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export const SharableNavVertical = ({ openNav, onCloseNav }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');
  const navData = useSharableNavData();

  const muiTheme = useTheme();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
      <NavSectionVertical data={navData} />
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
              <Typography variant="subtitle1">Guest</Typography>
            </Box>
          </Box>
          {/* <TourDialog /> */}
          <Button
            color="primary"
            variant="contained"
            onClick={() => router.push(paths.auth.login)}
            startIcon={<Iconify icon="fluent:person-arrow-right-20-filled" />}
          >
            Sign In
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
};
