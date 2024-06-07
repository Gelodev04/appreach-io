import Image from 'next/image';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const url = `https://outreachmagic.io/email-reporting-tutorial/`;

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
            src="/assets/illustrations/dashboard/person.png"
            width={240}
            height={240}
            alt="Envelope"
            priority
          />
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle1">Have questions?</Typography>

          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Take a look at our training library on how to get the most out of Outreach Magic
          </Typography>
        </Stack>

        <Button variant="contained" href={url} target="_blank" rel="noopener">
          Access training
        </Button>
      </Stack>
    </Stack>
  );
}
