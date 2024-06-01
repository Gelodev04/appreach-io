import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label/label';
import { RHFTextField } from 'src/components/hook-form';

import SeedAccountsBatch from './seed-accounts-batch';
import SeedAccountsAssigned from './seed-accounts-assigned';

// ----------------------------------------------------------------------

const SEED_ACCOUNTS = [
  { name: 'google_business', amount: 21 },
  { name: 'google_personal', amount: 195 },
  { name: 'microsoft_business', amount: 21 },
  { name: 'microsoft_personal', amount: 673 },
  { name: 'yahoo_personal', amount: 236 },
];

export default function SeedAccountsGenerator() {
  const isMobile = useResponsive('down', 'sm');
  return (
    <>
      <Stack direction={{ sm: 'row' }} gap={2} sx={{ width: '100%' }}>
        <Stack gap={1} alignItems="flex-start" sx={{ width: '100%' }}>
          <Typography variant="subtitle2">How many accounts you want to generate?</Typography>

          <RHFTextField
            name="totalSeedAccounts"
            size="small"
            sx={{ maxWidth: 100 }}
            placeholder="25"
            type="number"
          />
        </Stack>

        <Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem />
        <Box sx={{ width: '100%' }}>
          <SeedAccountsAssigned totalAssignedAccounts={100} />
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {SEED_ACCOUNTS.map((account) => (
          <Grid item key={account.name}>
            <SeedAccountsBatch seed={account} />
          </Grid>
        ))}
        <Grid item>
          <Stack direction="row" alignItems="center" gap={1}>
            <Label color="success" startIcon={<Iconify icon="pepicons-print:seedling" />}>
              Total accounts
            </Label>
            <Typography variant="h5">1,146</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
