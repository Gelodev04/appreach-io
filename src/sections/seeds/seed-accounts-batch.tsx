import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label/label';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

interface SeedAccountsBatchProps {
  name: string;
  amount: number;
}

export default function SeedAccountsBatch({ seed }: { seed: SeedAccountsBatchProps }) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Label color="primary">{seed.amount}</Label>
      <Typography variant="body2">{seed.name}</Typography>

      <RHFTextField
        name={seed.name}
        size="small"
        sx={{ maxWidth: 60 }}
        placeholder="25"
        type="number"
      />
    </Stack>
  );
}
