import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

export default function NavBottom() {
  return (
    <Stack
      sx={{
        px: 2,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative', width: '170px', height: '170px' }}>
          <Image
            src="/assets/illustrations/dashboard/menu-graphic.png"
            alt="Envelope"
            priority
            style={{ objectFit: 'cover' }}
            fill
            sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 170px"
          />
        </Box>
      </Stack>
    </Stack>
  );
}
