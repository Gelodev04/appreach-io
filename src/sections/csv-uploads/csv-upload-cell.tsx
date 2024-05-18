import { GridCellParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';

type RenderCsvUploadCellProps = {
  params: GridCellParams;
  type:
    | 'host'
    | 'importName'
    | 'importSource'
    | 'companyCreated'
    | 'companyUpdated'
    | 'companyIgnored'
    | 'personCreated'
    | 'personUpdated'
    | 'personIgnored'
    | 'errors'
    | 'dateUploaded'
    | 'status';
};

const RenderCsvUploadCell = ({ params, type }: RenderCsvUploadCellProps) => {
  switch (type) {
    case 'host':
      return <Typography variant="body2">{params.row.host}</Typography>;
    case 'importName':
      return (
        <Typography variant="body2" sx={{ my: 1 }}>
          {params.row.importName}
        </Typography>
      );
    case 'importSource':
      return <Typography variant="body2">{params.row.importSource}</Typography>;
    case 'companyCreated':
      return <Typography variant="body2">{params.row.companyCreated}</Typography>;
    case 'companyUpdated':
      return <Typography variant="body2">{params.row.companyUpdated}</Typography>;
    case 'companyIgnored':
      return <Typography variant="body2">{params.row.companyIgnored}</Typography>;
    case 'personCreated':
      return <Typography variant="body2">{params.row.personCreated}</Typography>;
    case 'personUpdated':
      return <Typography variant="body2">{params.row.personUpdated}</Typography>;
    case 'errors':
      return <Typography variant="body2">{params.row.errors}</Typography>;
    case 'dateUploaded':
      return <Typography variant="body2">{fDateTime(params.row.dateUploaded)}</Typography>;
    case 'status':
      return (
        <Label variant="soft" color={(params.row.status === 'success' && 'success') || 'error'}>
          {params.row.status}
        </Label>
      );
    default:
      return null;
  }
};

export default RenderCsvUploadCell;
