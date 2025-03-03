import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { fDate } from 'src/utils/format-time';
import { HubspotSyncButton } from '../_components/hubspot-sync-button';

export const useHubspotCol = () => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'profile',
      headerName: 'Assigned Profile',
      flex: 1,
    },
    {
      field: 'contacts',
      headerName: 'Contacts',
      flex: 1,
    },
    {
      field: 'campaignId',
      headerName: 'Campaign ID',
      flex: 1,
    },

    {
      field: 'created',
      headerName: 'Created',
      sortable: true,
      valueGetter: (params) => params?.row?.created,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.created)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
    {
      field: 'updated',
      headerName: 'Updated',
      sortable: true,
      valueGetter: (params) => params?.row?.updated,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.updated)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => <HubspotSyncButton />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
  ];

  return { columns };
};
