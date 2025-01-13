import { Button, Chip, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';
import useGetSubmitTitle from '../hooks/use-get-submit-title';

type Props = {
  onSubmit?: () => void | Promise<void> | undefined;
  title: string | number;
  subtitle?: string;
  price?: number;
  features?: string[];
  comment?: string;
  name: string;
  currentPlan?: string | null;
  expirationDate?: Date | null;
  planStatus?: string | null;
};

export function CheckoutElementV2({
  onSubmit,
  title,
  name,
  subtitle,
  price,
  features,
  comment,
  currentPlan,
  expirationDate,
  planStatus,
}: Props) {
  const { submitTitle, submitSubtitle, submitButtonVariant, isCancelledButNotExpired } =
    useGetSubmitTitle({
      name,
      planStatus,
      currentPlan,
      expirationDate,
    });
  console.log({ name, submitTitle, submitSubtitle, submitButtonVariant, isCancelledButNotExpired });

  return (
    <Stack
      gap={1}
      width={350}
      minHeight={480}
      borderRadius={2}
      p={2}
      justifyContent="space-between"
      alignItems="center"
      overflow="hidden"
      border={name === currentPlan ? 2 : 0}
      boxShadow={(theme) => (name === currentPlan ? theme.shadows[12] : theme.customShadows.z8)}
      sx={{
        bgcolor: (theme) => theme.palette.grey[50],
      }}
    >
      <Stack>
        <Typography fontSize={18} fontWeight={600} lineHeight={1}>
          {title}
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>

      {price && (
        <Stack direction="row" alignItems="baseline">
          <Typography fontSize={36} fontWeight={700}>
            {fCurrency(price)}
          </Typography>
          <Typography fontSize={16} fontWeight={700} color="text.secondary">
            /mo
          </Typography>
        </Stack>
      )}

      <List>
        {features?.map((text, index) => (
          <ListItem key={index} sx={{ textAlign: 'center', textWrap: 'balance' }}>
            <ListItemText secondary={text} />
          </ListItem>
        ))}
      </List>

      {comment && (
        <Typography fontSize={12} textAlign="start" mb={2}>
          {comment}
        </Typography>
      )}

      <Stack gap={1} width={1}>
        {submitSubtitle && (
          <Chip
            label={
              <Typography fontSize={14} fontWeight={600}>
                {submitSubtitle}
              </Typography>
            }
            variant={isCancelledButNotExpired ? 'outlined' : 'filled'}
            color={isCancelledButNotExpired ? 'error' : 'default'}
          />
        )}

        <Button
          size="large"
          onClick={onSubmit}
          fullWidth
          variant={submitButtonVariant === 'primary' ? 'contained' : 'outlined'}
          color={name === 'custom' ? 'inherit' : submitButtonVariant}
        >
          {submitTitle}
        </Button>
      </Stack>
    </Stack>
  );
}
