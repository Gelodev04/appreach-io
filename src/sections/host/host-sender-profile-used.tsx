import { Box, Button, Typography } from '@mui/material';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { useGetSenders } from 'src/hooks/api/senders';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { SenderProfileSkeleton } from './sender-profile-skeleton';

const SenderProfileUsed = () => {
  const { senders, sendersError, sendersLoading } = useGetSenders();
  if (sendersError)
    return (
      <EmptyContent
        title={sendersError.status}
        description={sendersError.message}
        action={
          <Button
            component={RouterLink}
            href={paths.settings.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            Back to List
          </Button>
        }
      />
    );

  if (sendersLoading) return <SenderProfileSkeleton />;
  return (
    <Box sx={{ paddingY: 1 }}>
      <Typography sx={{ fontWeight: 600, textAlign: 'end' }}>
        Profile used:{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {senders?.usedCount}{' '}
        </Typography>
        of{' '}
        <Typography component="span" sx={{ fontWeight: 800 }}>
          {senders?.assignedCount}
        </Typography>
      </Typography>
    </Box>
  );
};

export default SenderProfileUsed;
