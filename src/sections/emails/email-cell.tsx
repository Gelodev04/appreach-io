import Checkbox from '@mui/material/Checkbox';
import { GridCellParams } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify/iconify';

type RenderEmailCellProps = {
  params: GridCellParams;
  type:
    | 'email'
    | 'host'
    | 'server'
    | 'inboxPlacement'
    | 'inboxEngagement'
    | 'placementAccount'
    | 'engagementAccount'
    | 'inboxReset'
    | 'relayAccount'
    | 'vpsName'
    | 'smtp'
    | 'imap'
    | 'status';
};

const RenderEmailCell = ({ params, type }: RenderEmailCellProps) => {
  switch (type) {
    case 'email':
      return (
        <Typography variant="body2" sx={{ my: 2 }} noWrap>
          {params.row.email}
        </Typography>
      );
    case 'host':
      return <Typography variant="body2">{params.row.host}</Typography>;
    case 'server':
      return <Typography variant="body2">{params.row.server}</Typography>;
    case 'inboxPlacement':
      return <Checkbox checked={params.row.inboxPlacement} />;
    case 'inboxEngagement':
      return <Checkbox checked={params.row.inboxEngagement} />;
    case 'placementAccount':
      return <Checkbox checked={params.row.placementAccount} />;
    case 'engagementAccount':
      return <Checkbox checked={params.row.engagementAccount} />;
    case 'inboxReset':
      return <Checkbox checked={params.row.inboxReset} />;
    case 'relayAccount':
      return <Checkbox checked={params.row.relayAccount} />;
    case 'vpsName':
      return <Typography variant="body2">{params.row.vpsName}</Typography>;
    case 'smtp':
      if (params.row.smtp) {
        return <Iconify icon="mdi:check" color="success.main" />;
      } 
        return <Iconify icon="mdi:close" color="error.main" />;
      
    case 'imap':
      if (params.row.imap) {
        return <Iconify icon="mdi:check" color="success.main" />;
      } 
        return <Iconify icon="mdi:close" color="error.main" />;
      
    case 'status':
      return (
        <Label variant="soft" color={(params.row.status === 'Active' && 'success') || 'error'}>
          {params.row.status}
        </Label>
      );
    default:
      return null;
  }
};

export default RenderEmailCell;
