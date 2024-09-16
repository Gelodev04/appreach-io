import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';

export function LookerStudioSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ height: '100%' }}>
      <Skeleton sx={{ height: '100%' }} />
    </Container>
  );
}
