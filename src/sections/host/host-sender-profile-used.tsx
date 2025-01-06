import { Box, Button, Typography } from '@mui/material';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { ISenders } from 'src/types/senders';
import { SenderProfileSkeleton } from './sender-profile-skeleton';

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
