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
  onClick: () => Promise<void> | undefined;
  title: string | number;
  price: string | number;
};

export function CheckoutElement({ onClick, title, price }: Props) {
  return (
    <Stack
      minWidth={320}
      height={400}
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
          *Price per domain
        </Typography>
      </Stack>

      <Stack px={4} py={2}>
        <List>
          <ListItem>
            <ListItemIcon sx={{ color: '#b3c1db' }}>
              <Icon icon="icon-park-solid:check-one" />
            </ListItemIcon>
            <ListItemText secondary="Works with all email providers to audit and monitor your existing domain." />
          </ListItem>
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
