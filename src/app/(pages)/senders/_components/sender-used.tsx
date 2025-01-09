import { Box, Typography } from '@mui/material';
import React from 'react';

type SenderUsedType = {
  numOfAddressesUsed: number;
  numOfAddressesAssigned: number;
};

const SenderUsed = ({ numOfAddressesAssigned, numOfAddressesUsed }: SenderUsedType) => {
  return (
    <Box sx={{ paddingY: 1 }}>
      <Typography sx={{ fontWeight: 600, textAlign: 'end' }}>
        Senders used:{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {numOfAddressesUsed}{' '}
        </Typography>
        of{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {numOfAddressesAssigned}
        </Typography>
      </Typography>
    </Box>
  );
};

export default SenderUsed;
