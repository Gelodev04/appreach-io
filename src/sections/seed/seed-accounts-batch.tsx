import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChangeEvent } from 'react';
import { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label/label';
import { ISeedAccount } from 'src/types/seed';

export default function SeedAccountsBatch({
  seed,
  onChangeIndividualSeedAccounts,
}: {
  seed: ISeedAccount;
  onChangeIndividualSeedAccounts?: (
    value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Label color="primary">{seed.amount}</Label>
      <Typography variant="body2">{seed.name}</Typography>

      <RHFTextField
        onChange={onChangeIndividualSeedAccounts}
        name={seed.name}
        size="small"
        sx={{ maxWidth: 60 }}
        placeholder="25"
        type="number"
      />
    </Stack>
  );
}
