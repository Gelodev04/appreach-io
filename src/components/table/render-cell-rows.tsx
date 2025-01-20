import { GridCellParams } from '@mui/x-data-grid';
import Label from 'src/components/label';

type ParamsProps = {
  params: GridCellParams;
};

export const RenderCellStatus = ({ params }: ParamsProps) => {
  return (
    <Label variant="soft" color={(params.row.status === 'success' && 'success') || 'error'}>
      {params.row.status}
    </Label>
  );
};
