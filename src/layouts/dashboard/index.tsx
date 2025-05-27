import Box from '@mui/material/Box';
import { usePathname } from 'next/navigation';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { HEADER } from '../config-layout';
import Header from './header';
import Main from './main';
import NavHorizontal from './nav-horizontal';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const nav = useBoolean();
  const pathname = usePathname();

  const isHorizontal = settings.themeLayout === 'horizontal';
  const isMini = settings.themeLayout === 'mini';
  const isDashboardRoot = pathname === '/dashboard/';

  const renderNavMini = <NavMini />;
  const renderHorizontal = <NavHorizontal />;
  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;
  const mainContent = isDashboardRoot ? (
    <Box component="main" sx={{ flexGrow: 1 }}>
      {children}
    </Box>
  ) : (
    <Main>{children}</Main>
  );

  if (isHorizontal) {
    return (
      <>
        {/* <Header onOpenNav={nav.onTrue} /> */}

        {lgUp ? renderHorizontal : renderNavVertical}

        {mainContent}
      </>
    );
  }

  if (isMini) {
    return (
      <>
        {/* <Header onOpenNav={nav.onTrue} /> */}

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          {mainContent}
        </Box>
      </>
    );
  }

  return (
    <>
      {!lgUp && <Header onOpenNav={nav.onTrue} />}

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          ...(!lgUp && {
            marginTop: `${HEADER.H_MOBILE}px`,
          }),
        }}
      >
        {renderNavVertical}

        {mainContent}
      </Box>
    </>
  );
}
