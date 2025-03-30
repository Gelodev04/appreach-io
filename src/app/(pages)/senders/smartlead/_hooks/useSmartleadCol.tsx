import { Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { HostDropdown } from 'src/components/dropdown-select/host-dropdown';
import { updateSmartleadHost } from 'src/services/db/smartlead';
import { fDate } from 'src/utils/format-time';
import { DeleteSmartLeadButton } from '../_components/delete-smart-lead-button';
import { EspDropdown } from '../_components/esp-dropdown';

type OptionType = {
  profile: string;
  id: string;
}[];

export const useSmartleadCol = (options: OptionType) => {
  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'smartlead.client_id',
      headerName: 'SL Client ID',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      valueGetter: (params) => params?.row?.smartlead?.client_id,
      renderCell: (params) => {
        console.log(params);
        return params?.row?.smartlead?.client_id;
      },
      flex: 1,
    },
    {
      field: 'smartlead.type',
      headerName: 'SL Type',
      valueGetter: (params) => params?.row?.smartlead?.type,
      renderCell: (params) => {
        return (
          <div title={params?.row?.smartlead?.type} style={{ overflow: 'hidden' }}>
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap' }}>
              {params?.row?.smartlead?.type}
            </Typography>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: 'hostId',
      headerName: 'Host',
      renderCell: (params) => {
        return <HostDropdown params={params} options={options} onUpdate={updateSmartleadHost} />;
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'esp',
      headerName: 'ESP',
      renderCell: (params) => {
        return <EspDropdown params={params} />;
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      sortable: true,
      valueGetter: (params) => params?.row?.lastUpdated,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.lastUpdated)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return <DeleteSmartLeadButton id={params?.row?.id} username={params?.row?.username} />;
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
  ];

  return { columns };
};
