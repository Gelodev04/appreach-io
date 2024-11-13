import { Box, Typography } from '@mui/material';
import React from 'react';

const SenderUsed = () => {
  return (
    <Box sx={{ paddingY: 1 }}>
      <Typography sx={{ fontWeight: 600, textAlign: 'end' }}>
        Senders used:{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          5{' '}
        </Typography>
        of{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          5
        </Typography>
      </Typography>
    </Box>
  );
};

export default SenderUsed;
