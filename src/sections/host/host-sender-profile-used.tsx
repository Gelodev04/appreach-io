import { Box, Typography } from '@mui/material';

const SenderProfileUsed = () => {
  return (
    <Box sx={{ border: '1px red solid' }}>
      <Typography sx={{ fontWeight: 600, textAlign: 'end' }}>
        Profile used:{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          3{' '}
        </Typography>
        of{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          5
        </Typography>
      </Typography>
    </Box>
  );
};

export default SenderProfileUsed;
