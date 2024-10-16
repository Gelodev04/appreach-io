import { Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

type Props = {
  onClick: () => void | Promise<void> | undefined;
  title: string | number;
  subtitle?: string;
  price?: string | number;
  features?: string[];
  comment?: string;
  isCurrentPlan?: boolean;
  SubmitProps?: React.ComponentProps<typeof Button>;
};

export function CheckoutElement({
  onClick,
  title,
  subtitle,
  price,
  features,
  comment,
  isCurrentPlan,
  SubmitProps,
}: Props) {
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
        {features?.map((text) => (
          <ListItem sx={{ textAlign: 'center', alignItems: 'center' }}>
            <ListItemText secondary={text} />
          </ListItem>
        ))}
      </List>

      {comment && (
        <Typography fontSize={12} textAlign="start" mb={2}>
          {comment}
        </Typography>
      )}

      {isCurrentPlan && (
        <Typography fontSize={14} fontWeight={600}>
          This is your current plan
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={onClick}
        fullWidth
        {...SubmitProps}
      />
    </Stack>
  );
}
