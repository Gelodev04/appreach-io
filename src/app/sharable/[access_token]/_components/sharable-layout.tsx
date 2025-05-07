'use client';

import Box from '@mui/material/Box';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { HEADER } from 'src/layouts/config-layout';
import Header from 'src/layouts/dashboard/header';
import Main from 'src/layouts/dashboard/main';
import { SharableNavHorizontal } from './sharable-nav-horizontal';
import { SharableNavMini } from './sharable-nav-mini';
import { SharableNavVertical } from './sharable-nav-vertical';

type Props = {
  children: React.ReactNode;
};

export const SharableLayout = ({ children }: Props) => {
  const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const nav = useBoolean();
  const isHorizontal = settings.themeLayout === 'horizontal';
  const isMini = settings.themeLayout === 'mini';
  const renderNavMini = <SharableNavMini />;
  const renderHorizontal = <SharableNavHorizontal />;
  const renderNavVertical = <SharableNavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isHorizontal) {
    return (
      <>
        {/* <Header onOpenNav={nav.onTrue} /> */}

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
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

          <Main>{children}</Main>
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

        <Main>{children}</Main>
      </Box>
    </>
  );
};
