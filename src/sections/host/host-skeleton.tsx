import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

export function HostSkeleton() {
  return (
    <Container maxWidth="md">
      <Stack gap={2}>
        <Skeleton height={50} />
        <Skeleton height={30} />

        <Skeleton height={300} />
      </Stack>
    </Container>
  );
}
