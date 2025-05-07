import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';
import Iconify from 'src/components/iconify';
import { LogoSymbol } from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';
import NavToggleButton from 'src/layouts/common/nav-toggle-button';
import { NAV } from 'src/layouts/config-layout';
import { paths } from 'src/routes/paths';
import { hideScroll } from 'src/theme/css';
import { useSharableNavData } from '../_hooks/useSharableNavData';

export const SharableNavMini = () => {
  const navData = useSharableNavData();
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

        <NavSectionMini data={navData} />
        <Box sx={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={() => router.push(paths.auth.login)} color="primary" size="large">
            <Iconify icon="fluent:person-arrow-right-20-filled" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
};
