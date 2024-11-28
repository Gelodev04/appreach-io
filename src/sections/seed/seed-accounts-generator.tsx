import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label/label';
import { ISeedAccount } from 'src/types/seed';
import SeedAccountsAssigned from './seed-accounts-assigned';
import SeedAccountsBatch from './seed-accounts-batch';

export default function SeedAccountsGenerator({
  assignedCount,
  seedAccounts,
  totalSeedAccounts,
}: {
  assignedCount: number;
  seedAccounts: ISeedAccount[];
  totalSeedAccounts?: number;
}) {
  return (
    <>
      <Stack direction={{ sm: 'row' }} gap={2} sx={{ width: '100%' }}>
        <Stack gap={1} alignItems="flex-start" sx={{ width: '100%' }}>
          <Typography variant="subtitle2">How many accounts do you want to generate?</Typography>

          <RHFTextField
            name="seedAccountsGenerator"
            size="small"
            sx={{ maxWidth: 100 }}
            placeholder="25"
            type="number"
          />
        </Stack>

        <Box sx={{ width: '100%' }}>
          <SeedAccountsAssigned totalAssignedAccounts={assignedCount} />
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {seedAccounts.map((account) => (
          <Grid item key={account.name}>
            <SeedAccountsBatch seed={account} />
          </Grid>
        ))}
        <Grid item>
          <Stack direction="row" alignItems="center" gap={1}>
            <Label color="success" startIcon={<Iconify icon="pepicons-print:seedling" />}>
              Total accounts
            </Label>
            <Typography variant="h5">{totalSeedAccounts || 0}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
