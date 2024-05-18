import Image from 'next/image';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function SeedAccountsAssigned({
  totalAssignedAccounts,
}: {
  totalAssignedAccounts: number;
}) {
  return (
    <Stack direction="row" gap={1}>
      <Image src="/assets/illustrations/seeds/seed.png" width={60} height={60} alt="seed" />
      <Stack>
        <Typography variant="h5">{totalAssignedAccounts}</Typography>
        <Typography variant="body2">Seed accounts assigned</Typography>
      </Stack>
    </Stack>
  );
}
