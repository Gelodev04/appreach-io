import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

export function SenderProfileSkeleton() {
  return (
    <Container sx={{ paddingY: 1 }}>
      <Skeleton height={30} width={200} sx={{ marginLeft: 'auto' }} />
    </Container>
  );
}
