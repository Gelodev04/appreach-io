import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Logo from 'src/components/logo';
import { useResponsive } from 'src/hooks/use-responsive';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

type Props = {
  image?: string;
  expanded?: boolean;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, expanded, image }: Props) {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: { md: 'absolute' },
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        height: 'full',
        justifyContent: 'center',
        mx: 'auto',
        maxWidth: expanded ? 520 : 480,
        px: { xs: 2, md: 8 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/auth/login.png'}
        sx={{
          maxWidth: {
            xs: 480,
            lg: 560,
            xl: 720,
          },
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction={{ md: 'row' }}
      sx={{
        paddingY: { xs: 1, md: 0 },
        minHeight: { md: '100vh' },
      }}
    >
      {renderLogo}

      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
