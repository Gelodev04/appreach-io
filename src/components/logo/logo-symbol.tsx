import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const LogoSymbol = forwardRef<HTMLDivElement, LogoProps>(({ disabledLink = false, sx }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="img"
      src="/logo/logo_symbol.png"
      sx={{ width: 54, height: 47, cursor: 'pointer', ...sx }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

export default LogoSymbol;
