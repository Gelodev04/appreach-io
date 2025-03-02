import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import Iconify from 'src/components/iconify';
import { LogoSymbol } from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { paths } from 'src/routes/paths';
import { hideScroll } from 'src/theme/css';
import NavToggleButton from '../common/nav-toggle-button';
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';

export default function NavMini() {
  const { user } = useMockedUser();
  const navData = useNavData();
  const router = useRouter();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Box sx={{ alignSelf: 'center', my: 2 }}>
          <LogoSymbol />
        </Box>

        <NavSectionMini
          data={navData}
          slotProps={{
            currentRole: user?.role,
          }}
        />
        <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={() => router.push(paths.auth.logout)} color="primary" size="large">
            <Iconify icon="hugeicons:logout-04" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}
