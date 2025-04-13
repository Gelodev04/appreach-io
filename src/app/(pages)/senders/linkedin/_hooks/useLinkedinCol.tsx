import { GridColDef } from '@mui/x-data-grid';
import { HostDropdown } from 'src/components/dropdown-select/host-dropdown';
import { SenderConfigDropdown } from 'src/components/dropdown-select/sender-config-dropdown';
import { paths } from 'src/routes/paths';
import {
  updateSenderAccountHost,
  updateSenderAccountPlatform,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { SenderAccountsActions } from '../_components/delete-sender-account';

export const useLinkedinCol = (
  hostOptions: HostOptionsType,
  platFormOptions: PlatformOptionsType
) => {
  const columns: GridColDef[] = [
    {
      field: 'sender',
      headerName: 'Sender',
      flex: 1,
    },
    {
      field: 'sender_name',
      headerName: 'Sender Name',
      flex: 1,
    },
    {
      field: 'platform',
      headerName: 'Platform',
      renderCell: (params) => {
        return (
          <SenderConfigDropdown
            params={params}
            options={platFormOptions}
            path={paths.senders.linkedin}
            onUpdate={updateSenderAccountPlatform}
          />
        );
      },
      flex: 1,
    },
    {
      field: 'host_id',
      headerName: 'Assigned Profile',
      renderCell: (params) => {
        return (
          <HostDropdown params={params} options={hostOptions} onUpdate={updateSenderAccountHost} />
        );
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <SenderAccountsActions
            id={params?.row?.id}
            username={params?.row?.sender}
            path={paths.senders.linkedin}
          />
        );
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
