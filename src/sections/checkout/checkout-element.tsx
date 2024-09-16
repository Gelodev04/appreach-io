import { Button, Stack, Typography } from '@mui/material';

type Props = {
  onClick: () => Promise<void> | undefined;
  title: string | number;
  price: string | number;
};

export function CheckoutElement({ onClick, title, price }: Props) {
  return (
    <Stack
      border={2}
      px={4}
      py={2}
      minWidth={320}
      borderRadius={2}
      sx={{
        ':hover': { borderColor: 'orange' },
      }}
    >
      <Typography variant="h5">{title}</Typography>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dicta fugit, ratione at
        doloribus labore tempora voluptate, sed nemo vitae aspernatur dolore laudantium in a dolor
        placeat consequatur expedita possimus.
      </p>
      <Typography variant="h4">{price}</Typography>

      <Button
        variant="contained"
        size="large"
        onClick={onClick}
        sx={{
          my: 2,
          width: '100%',
        }}
      >
        Subscribe
      </Button>
    </Stack>
  );
}
