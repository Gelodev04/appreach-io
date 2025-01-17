import { Box, Typography } from '@mui/material';

type ItemUsageDisplay = {
  itemName: string;
  used: number;
  limit: number;
};

export const ItemUsageDisplay = ({ itemName, used, limit }: ItemUsageDisplay) => {
  return (
    <Box sx={{ paddingY: 1 }}>
      <Typography sx={{ fontWeight: 600, textAlign: 'end' }}>
        {itemName} used:{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {used}{' '}
        </Typography>
        of{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {limit}
        </Typography>
      </Typography>
    </Box>
  );
};
