import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { fDate } from 'src/utils/format-time';

export const useLeadStatusCol = () => {
  const columns: GridColDef[] = [
    {
      field: 'event_timestamp',
      headerName: 'Date',
      sortable: true,
      valueGetter: (params) => params.row.event_timestamp,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.event_timestamp)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
    {
      field: 'host_name',
      headerName: 'Profile',
      flex: 1,
    },
    {
      field: 'recipient',
      headerName: 'Recipient',
      renderCell: (params) => {
        const { recipient } = params.row;
        const displayValue = recipient?.email || recipient?.linkedin_url || 'N/A';

        return (
          <div title={params?.row?.smartlead?.type} style={{ overflow: 'hidden' }}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {displayValue}
            </Typography>
          </div>
        );
      },
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'sender',
      headerName: 'Sender',
      renderCell: (params) => {
        const { sender } = params.row;
        const displayValue = sender?.email || sender?.linkedin_profile || 'N/A';

        return (
          <div title={params?.row?.smartlead?.type} style={{ overflow: 'hidden' }}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {displayValue}
            </Typography>
          </div>
        );
      },
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'platform',
      headerName: 'Platform',
      flex: 1,
    },
    {
      field: 'lead_category.name',
      headerName: 'Status',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div title={params?.row?.smartlead?.type} style={{ overflow: 'hidden' }}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {params?.row?.lead_category?.name}
            </Typography>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: 'lead_category.sentiment',
      headerName: 'Sentiment',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <div title={params?.row?.smartlead?.type} style={{ overflow: 'hidden' }}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {params?.row?.lead_category?.sentiment}
            </Typography>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: 'content.body',
      headerName: 'Message',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.content?.body;
      },
      flex: 1,
    },
  ];

  return { columns };
};
