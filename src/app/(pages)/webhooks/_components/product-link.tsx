import { Link, Typography } from '@mui/material';
import { GridCellParams } from '@mui/x-data-grid';
import { RouterLink } from 'src/routes/components';

type ParamsProps = {
  params: GridCellParams;
};

export const ProductLink = ({ params }: ParamsProps) => {
  return (
    <Typography sx={{ my: 2 }}>
      <Link component={RouterLink} href={params.row.product_link}>
        {params.row.product}
      </Link>
    </Typography>
  );
};
