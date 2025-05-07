import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';

import { NavSectionHorizontal } from 'src/components/nav-section';
import Scrollbar from 'src/components/scrollbar';

import HeaderShadow from 'src/layouts/common/header-shadow';
import { HEADER } from 'src/layouts/config-layout';
import { useSharableNavData } from '../_hooks/useSharableNavData';

export const SharableNavHorizontal = () => {
  const theme = useTheme();
  const navData = useSharableNavData();

  return (
    <AppBar
      component="div"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <Scrollbar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
            },
          }}
        >
          <NavSectionHorizontal
            data={navData}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Scrollbar>
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
};
