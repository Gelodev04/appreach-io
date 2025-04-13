import { GridColDef } from '@mui/x-data-grid';
import { HostDropdown } from 'src/components/dropdown-select/host-dropdown';
import { SenderConfigDropdown } from 'src/components/dropdown-select/sender-config-dropdown';

import { paths } from 'src/routes/paths';
import {
  updateSenderAccountEmailReseller,
  updateSenderAccountEmailServer,
  updateSenderAccountHost,
  updateSenderAccountPlatform,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { SenderAccountsActions } from '../../linkedin/_components/delete-sender-account';

export const useEmailEventsCol = (
  hostOptions: HostOptionsType,
  platFormOptions: PlatformOptionsType,
  emailServerOptions: PlatformOptionsType,
  emailResellerOptions: PlatformOptionsType
) => {
  const columns: GridColDef[] = [
    {
      field: 'sender',
      headerName: 'Sender',
      flex: 1,
    },
    {
      field: 'email_server',
      headerName: 'Email Server',
      renderCell: (params) => {
        return (
          <SenderConfigDropdown
            params={params}
            path={paths.senders.emailEvents}
            options={emailServerOptions}
            onUpdate={updateSenderAccountEmailServer}
          />
        );
      },
      flex: 1,
    },
    {
      field: 'email_reseller',
      headerName: 'Email Reseller',
      renderCell: (params) => {
        return (
          <SenderConfigDropdown
            params={params}
            path={paths.senders.emailEvents}
            options={emailResellerOptions}
            onUpdate={updateSenderAccountEmailReseller}
          />
        );
      },
      flex: 1,
    },
    {
      field: 'platform',
      headerName: 'Platform',
      renderCell: (params) => {
        return (
          <SenderConfigDropdown
            params={params}
            path={paths.senders.emailEvents}
            options={platFormOptions}
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
            path={paths.senders.emailEvents}
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
