import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

export default function NavBottom() {
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
            src="/assets/illustrations/dashboard/menu-graphic.png"
            width={200}
            height={200}
            alt="Envelope"
            priority
          />
        </Box>
      </Stack>
    </Stack>
  );
}
