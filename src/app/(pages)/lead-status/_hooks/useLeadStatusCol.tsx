import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { RenderCellText } from 'src/components/table/render-cell-rows';
import { fDateTime } from 'src/utils/format-time';
import { LeadStatusMessage } from '../_components/lead-status-message';

export const useLeadStatusCol = () => {
  const columns: GridColDef[] = [
    {
      field: 'event_timestamp',
      headerName: 'Date',
      sortable: true,
      valueGetter: (params) => params.row.event_timestamp,
      renderCell: (params) => {
        return <Typography sx={{ my: 2 }}>{fDateTime(params.row.event_timestamp)}</Typography>;
      },
      type: 'date',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'host_name',
      headerName: 'Profile',
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.host_name} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'recipient',
      headerName: 'Recipient',
      valueGetter: (params) => params.row.recipient.email || params.row.recipient.linkedin_url,
      renderCell: (params) => {
        const { recipient } = params.row;
        const displayValue = recipient?.email || recipient?.linkedin_url || 'N/A';

        return <RenderCellText displayValue={displayValue} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'sender',
      headerName: 'Sender',
      valueGetter: (params) => params.row.recipient.email || params.row.recipient.linkedin_url,
      renderCell: (params) => {
        const { sender } = params.row;
        const displayValue = sender?.email || sender?.linkedin_profile || 'N/A';

        return <RenderCellText displayValue={displayValue} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'platform',
      headerName: 'Platform',
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.platform} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'lead_status.name',
      headerName: 'Status',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (params) => {
        return params.row.lead_status.name;
      },
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.lead_status?.name} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'sentiment',
      headerName: 'Sentiment',
      headerAlign: 'left',
      align: 'left',
      filterable: false,
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.sentiment} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'content.body',
      headerName: 'Message',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (params) => {
        return params.row.content.body;
      },
      renderCell: (params) => {
        return <LeadStatusMessage params={params} />;
      },
      flex: 1,
      minWidth: 200,
    },
  ];

  return { columns };
};
