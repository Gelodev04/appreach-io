import { Box, Typography } from '@mui/material';

type TSenderProfileUsed = {
  numOfProfileAssigned: number;
  numOfProfileUsed: number;
};

const SenderProfileUsed = ({ numOfProfileAssigned, numOfProfileUsed }: TSenderProfileUsed) => {
  return (
    <Box sx={{ paddingY: 1 }}>
      <Typography sx={{ fontWeight: 600, textAlign: 'end' }}>
        Profiles used:{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {numOfProfileUsed}{' '}
        </Typography>
        of{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {numOfProfileAssigned}
        </Typography>
      </Typography>
    </Box>
  );
};

export default SenderProfileUsed;
