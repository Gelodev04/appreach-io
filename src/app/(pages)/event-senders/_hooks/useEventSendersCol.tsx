import { GridColDef } from '@mui/x-data-grid';
import { EventSendersDropdown } from 'src/components/dropdown-select/event-senders-dropdown';
import { HostDropdown } from 'src/components/dropdown-select/host-dropdown';

import { RenderCellText } from 'src/components/table/render-cell-rows';
import {
  updateSenderAccountEmailReseller,
  updateSenderAccountEmailServer,
  updateSenderAccountHost,
  updateSenderAccountPlatform,
  updateSenderAccountType,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { EventSendersActions } from '../_components/event-senders-actions';
import { EventSendersTextbox } from '../_components/event-senders-textbox';

export const useEventSendersCol = (
  hostOptions: HostOptionsType,
  platFormOptions: PlatformOptionsType,
  emailServerOptions: PlatformOptionsType,
  emailResellerOptions: PlatformOptionsType,
  typeOptions: PlatformOptionsType
) => {
  const columns: GridColDef[] = [
    {
      field: 'sender',
      headerName: 'Sender',
      renderCell: (params) => {
        return <RenderCellText displayValue={params?.row?.sender} />;
      },
      flex: 1,
      minWidth: 200,
      cellClassName: 'sticky-col-1',
      headerClassName: 'sticky-col-1',
    },
    {
      field: 'sender_label',
      headerName: 'Sender Label',
      renderCell: (params) => {
        return <EventSendersTextbox params={params} />;
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'email_server',
      headerName: 'Email Server',
      renderCell: (params) => {
        return (
          <EventSendersDropdown
            params={params}
            options={emailServerOptions}
            onUpdate={updateSenderAccountEmailServer}
          />
        );
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'email_reseller',
      headerName: 'Email Reseller',
      renderCell: (params) => {
        return (
          <EventSendersDropdown
            params={params}
            options={emailResellerOptions}
            onUpdate={updateSenderAccountEmailReseller}
          />
        );
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'platform',
      headerName: 'Platform',
      renderCell: (params) => {
        return (
          <EventSendersDropdown
            params={params}
            options={platFormOptions}
            onUpdate={updateSenderAccountPlatform}
          />
        );
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'type',
      headerName: 'Type',
      renderCell: (params) => {
        return (
          <EventSendersDropdown
            params={params}
            options={typeOptions}
            onUpdate={updateSenderAccountType}
          />
        );
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'host_id',
      headerName: 'Assigned Profile',
      valueGetter: (params) => {
        return params.row.host_name; // Use host_name for filtering/sorting
      },
      renderCell: (params) => {
        return (
          <HostDropdown params={params} options={hostOptions} onUpdate={updateSenderAccountHost} />
        );
      },
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return <EventSendersActions id={params?.row?.id} username={params?.row?.sender} />;
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      minWidth: 200,
    },
  ];

  return { columns };
};
