import { Box, Typography } from '@mui/material';

export default function DatabaseInfo() {
  return (
    <Box sx={{ position: 'absolute', zIndex: 10, right: 1, top: 1 }}>
      <Typography fontSize={9} fontWeight="bold" fontFamily="monospace">
        {process.env.MONGODB_DATABASE}
      </Typography>
    </Box>
  );
}
