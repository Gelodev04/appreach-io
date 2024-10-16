import Typography from '@mui/material/Typography';
import { GridCellParams } from '@mui/x-data-grid';
import Label from 'src/components/label';
import { fDate } from 'src/utils/format-time';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellDateAdded({ params }: ParamsProps) {
  return <Typography sx={{ my: 2 }}>{fDate(params.row.dateAdded)}</Typography>;
}

export function RenderCellImportName({ params }: ParamsProps) {
  return <Typography>{params.row.name}</Typography>;
}

export function RenderCellGenerateTotal({ params }: ParamsProps) {
  return <Typography>{params.row.generate?.total}</Typography>;
}

export function RenderCellResultsTotal({ params }: ParamsProps) {
  return <Typography>{params.row.results?.total}</Typography>;
}

export function RenderCellToken({ params }: ParamsProps) {
  return <Typography>{params.row?.token}</Typography>;
}

export function RenderCellPublish({ params }: ParamsProps) {
  const { status } = params.row;

  if (status === 'ready') {
    return (
      <Label variant="soft" color="info">
        Ready
      </Label>
    );
  }

  if (status === 'expired') {
    return (
      <Label variant="soft" color="warning">
        Expired
      </Label>
    );
  }

  if (status === 'success') {
    return (
      <Label variant="soft" color="success">
        Success
      </Label>
    );
  }

  return (
    <Label variant="soft" color="error">
      Error
    </Label>
  );
}
