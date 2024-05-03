import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const url = `https://calendly.com/outreachmagic/demo?utm_source=webapp`;

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Image
            src="/assets/illustrations/dashboard/envelope.png"
            width={180}
            height={180}
            alt="Envelope"
            priority
          />
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2">Upgrade for Next-Level Outreach</Typography>

          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Unlock advanced lead generation tools and integration capabilities.
          </Typography>
        </Stack>

        <Button variant="contained" href={url} target="_blank" rel="noopener">
          Contact our team
        </Button>
      </Stack>
    </Stack>
  );
}
