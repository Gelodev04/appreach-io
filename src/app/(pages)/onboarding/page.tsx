import { Box, Container, Stack, Typography } from '@mui/material';
import { getUserSettings } from 'src/services/db/user-settings';
import { Calendly } from './_components/calendly';

export const metadata = {
  title: 'Attribute Uploads | Outreach Magic',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { appLogin } = await getUserSettings({
    appLogin: { select: { username: true, firstName: true, lastName: true } },
  });
  const { username, firstName, lastName } = appLogin;

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Stack justifyContent="center" height="100%" width="100%" spacing={4}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h2">Welcome to Outreach Magic!</Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
            }}
          >
            Schedule your onboarding to start your free trial.
          </Typography>
          <Calendly name={`${firstName} ${lastName}`} email={username} />
        </Box>
      </Stack>
    </Container>
  );
}
