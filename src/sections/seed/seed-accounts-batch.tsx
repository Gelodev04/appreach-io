import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label/label';
import { ISeedAccount } from 'src/types/seed';

export default function SeedAccountsBatch({ seed }: { seed: ISeedAccount }) {
  const { setValue } = useFormContext();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const newValue = Math.min(Math.max(0, value || 0), seed.amount);
    if (value <= seed.amount) setValue(seed.name, newValue);
  };

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
        onChange={handleInputChange}
      />
    </Stack>
  );
}
