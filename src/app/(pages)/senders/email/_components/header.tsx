import { Box, Link, Typography } from '@mui/material';
import { paths } from 'src/routes/paths';

export default function Header() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Verify a new sender email
      </Typography>
      <Typography
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 100 }}>
          <Link href={paths.senders.root}>Sender Addresses</Link>
        </Typography>
        <Typography sx={{ color: 'text.disabled' }}>
          <Box component="span" sx={{ mx: 1 }}>
            •
          </Box>{' '}
          Verify new email
        </Typography>
      </Typography>
    </Box>
  );
}
