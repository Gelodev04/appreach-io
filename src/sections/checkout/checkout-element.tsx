import { Icon } from '@iconify/react';
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

type Props = {
  onClick: () => void | Promise<void> | undefined;
  title: string | number;
  subtitle?: string;
  price: string | number;
  features?: string[];
};

export function CheckoutElement({ onClick, title, subtitle, price, features }: Props) {
  return (
    <Stack
      flex={1}
      minWidth={320}
      minHeight={480}
      borderRadius={2}
      overflow="hidden"
      sx={{
        bgcolor: '#e6eaf3',
      }}
    >
      <Stack
        px={4}
        py={2}
        textAlign="start"
        sx={{
          bgcolor: '#b3c1db',
          color: '#1a4593',
        }}
      >
        <Typography fontSize={13} fontWeight={600}>
          {title}
        </Typography>

        <Stack direction="row" alignItems="baseline">
          <Typography fontSize={30} fontWeight={700}>
            {price}
          </Typography>
          <Typography fontSize={16} fontWeight={700}>
            /mo
          </Typography>
        </Stack>

        <Typography fontSize={16} fontWeight={700}>
          {subtitle}
        </Typography>
      </Stack>

      <Stack justifyContent="space-between" height="100%" px={4} py={2}>
        <List>
          {features?.map((text) => (
            <ListItem sx={{ alignItems: 'start', pl: 0 }}>
              <ListItemIcon sx={{ mt: 1, mr: 1.5, color: '#b3c1db' }}>
                <Icon icon="icon-park-solid:check-one" />
              </ListItemIcon>
              <ListItemText secondary={text} />
            </ListItem>
          ))}
        </List>

        <Button
          variant="outlined"
          size="large"
          onClick={onClick}
          fullWidth
          sx={{
            my: 2,
            border: 2,
            color: '#1a4593',
            outlineColor: '#1a4593',
          }}
        >
          Try It Free
        </Button>
      </Stack>
    </Stack>
  );
}
