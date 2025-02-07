import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { fDate } from 'src/utils/format-time';
import { DeleteSmartLeadButton } from '../_components/delete-smart-lead-button';
import { EspDropdown } from '../_components/esp-dropdown';
import { HostDropdown } from '../_components/host-dropdown';

type OptionType = {
  profile: string;
  id: string;
}[];

export const useSmartleadCol = (options: OptionType) => {
  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Email',
      minWidth: 250,
      flex: 1,
    },
    {
      field: 'smartlead.clientId',
      headerName: 'SL Client ID',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      minWidth: 180,
      renderCell: (params) => {
        return params.row.smartlead.clientId;
      },
    },
    {
      field: 'smartlead.type',
      headerName: 'SL Type',
      minWidth: 180,
      renderCell: (params) => {
        return params.row.smartlead.type;
      },
    },
    {
      field: 'hostId',
      headerName: 'Host',
      minWidth: 200,
      renderCell: (params) => {
        return <HostDropdown params={params} options={options} />;
      },
    },
    {
      field: 'esp',
      headerName: 'ESP',
      minWidth: 300,
      renderCell: (params) => {
        return <EspDropdown params={params} />;
      },
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      sortable: true,
      minWidth: 190,
      valueGetter: (params) => params.row.lastUpdated,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.lastUpdated)}</Typography>;
      },
      type: 'date',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return <DeleteSmartLeadButton id={params.row.id} username={params.row.username} />;
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
    },
  ];

  return { columns };
};
