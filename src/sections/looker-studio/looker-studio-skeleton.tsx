import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

export function LookerStudioSkeleton() {
  return (
    <Container maxWidth="xl">
      <Skeleton height={500} />
    </Container>
  );
}
