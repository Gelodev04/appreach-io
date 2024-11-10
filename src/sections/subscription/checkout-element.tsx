import { Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

type Props = {
  onSubmit?: () => void | Promise<void> | undefined;
  title: string | number;
  subtitle?: string;
  price?: string | number;
  features?: string[];
  comment?: string;
  submitTitle?: string;
  submitSubtitle?: string;
  variant: 'purchase' | 'cancel' | 'neutral';
};

export function CheckoutElement({
  onSubmit,
  title,
  subtitle,
  price,
  features,
  comment,
  submitTitle,
  submitSubtitle,
  variant,
}: Props) {
  const getButtonColor = (): 'inherit' | 'primary' | 'error' => {
    if (variant === 'neutral') return 'inherit';
    if (variant === 'cancel') return 'error';
    return 'primary';
  };

  return (
    <Stack
      gap={1}
      minWidth={320}
      minHeight={480}
      borderRadius={2}
      p={2}
      justifyContent="space-between"
      alignItems="center"
      overflow="hidden"
      sx={{
        bgcolor: (theme) => theme.palette.grey[50],
        boxShadow: (theme) => theme.customShadows.z8,
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
            {price}
          </Typography>
          <Typography fontSize={16} fontWeight={700} color="text.secondary">
            /mo
          </Typography>
        </Stack>
      )}

      <List>
        {features?.map((text, index) => (
          <ListItem key={index} sx={{ textAlign: 'center', alignItems: 'center' }}>
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
          <Typography fontSize={14} fontWeight={600}>
            {submitSubtitle}
          </Typography>
        )}

        <Button
          size="large"
          onClick={onSubmit}
          fullWidth
          variant={variant === 'purchase' ? 'contained' : 'outlined'}
          color={getButtonColor()}
        >
          {submitTitle}
        </Button>
      </Stack>
    </Stack>
  );
}
