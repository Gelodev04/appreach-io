import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

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

        <Button variant="contained" href={url} target="_blank" rel="noopener">
          Access training
        </Button>
      </Stack>
    </Stack>
  );
}
