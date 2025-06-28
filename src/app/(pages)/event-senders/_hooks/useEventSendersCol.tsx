import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { EventSendersDropdown } from 'src/components/dropdown-select/event-senders-dropdown';
import { HostDropdown } from 'src/components/dropdown-select/host-dropdown';

import { Typography } from '@mui/material';
import { RenderCellText } from 'src/components/table/render-cell-rows';
import {
  updateSenderAccountEmailReseller,
  updateSenderAccountEmailServer,
  updateSenderAccountHost,
  updateSenderAccountPlatform,
  updateSenderAccountType,
} from 'src/services/db/sender-accounts';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { fDate } from 'src/utils/format-time';
import { EventSendersActions } from '../_components/event-senders-actions';
import { EventSendersTextbox } from '../_components/event-senders-textbox';

export const useEventSendersCol = (
  hostOptions: HostOptionsType,
  platFormOptions: PlatformOptionsType,
  emailServerOptions: PlatformOptionsType,
  emailResellerOptions: PlatformOptionsType,
  typeOptions: PlatformOptionsType,
  senderType: 'email' | 'linkedin' | 'crm'
) => {
  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: Record<string, GridColDef> = {
      sender: {
        field: 'sender',
        headerName: 'Sender',
        renderCell: (params) => <RenderCellText displayValue={params?.row?.sender} />,
        flex: 1,
        minWidth: senderType === 'email' ? 250 : 200,
        cellClassName: 'sticky-col-1',
        headerClassName: 'sticky-col-1',
      },
      sender_name: {
        field: 'sender_name',
        headerName: 'Sender Name',
        renderCell: (params) => <EventSendersTextbox params={params} />,
        flex: 1,
        minWidth: senderType === 'email' ? 250 : 200,
      },
      host_id: {
        field: 'host_id',
        headerName: 'Assigned Profile',
        valueGetter: (params) => params.row.host_name,
        renderCell: (params) => (
          <HostDropdown params={params} options={hostOptions} onUpdate={updateSenderAccountHost} />
        ),
        flex: 1,
        minWidth: 200,
      },
      platform: {
        field: 'platform',
        headerName: 'Platform',
        renderCell: (params) => (
          <EventSendersDropdown
            params={params}
            options={platFormOptions}
            onUpdate={updateSenderAccountPlatform}
          />
        ),
        flex: 1,
        minWidth: senderType === 'email' ? 200 : 180,
      },
      email_server: {
        field: 'email_server',
        headerName: 'Email Server',
        renderCell: (params) => (
          <EventSendersDropdown
            params={params}
            options={emailServerOptions}
            onUpdate={updateSenderAccountEmailServer}
          />
        ),
        flex: 1,
        minWidth: senderType === 'email' ? 270 : 200,
      },
      email_reseller: {
        field: 'email_reseller',
        headerName: 'Email Reseller',
        renderCell: (params) => (
          <EventSendersDropdown
            params={params}
            options={emailResellerOptions}
            onUpdate={updateSenderAccountEmailReseller}
          />
        ),
        flex: 1,
        minWidth: 220,
      },
      type: {
        field: 'type',
        headerName: 'Type',
        renderCell: (params) => (
          <EventSendersDropdown
            params={params}
            options={typeOptions}
            onUpdate={updateSenderAccountType}
          />
        ),
        flex: 1,
        minWidth: 200,
      },
      actions: {
        field: 'actions',
        headerName: 'Actions',
        headerAlign: 'left',
        align: 'left',
        renderCell: (params) => (
          <EventSendersActions id={params?.row?.id} username={params?.row?.sender} />
        ),
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
        flex: 1,
        minWidth: 200,
      },

      owner: {
        field: 'owner',
        headerName: 'Owner',
        renderCell: (params) => <RenderCellText displayValue={params?.row?.owner} />,
        flex: 1,
        minWidth: senderType === 'email' ? 250 : 200,
      },
      createdAt: {
        field: 'createdAt',
        headerName: 'Date Created',
        sortable: true,
        valueGetter: (params) => params.row.metadata.created_at,
        renderCell: (params) => (
          <Typography sx={{ fontSize: senderType === 'email' ? '0.85rem' : 'inherit', my: 2 }}>
            {fDate(params.row.metadata.created_at)}
          </Typography>
        ),
        type: 'date',
        flex: 1,
        minWidth: 200,
      },
    };

    const columnOrderMap: Record<typeof senderType, string[]> = {
      email: [
        'sender',
        'sender_name',
        'host_id',
        'platform',
        'email_server',
        'email_reseller',
        'type',
        'actions',
        'owner',
        'createdAt',
      ],
      linkedin: [
        'sender',
        'sender_name',
        'host_id',
        'platform',
        'type',
        'actions',
        'owner',
        'createdAt',
      ],
      crm: [
        'sender',
        'sender_name',
        'host_id',
        'platform',
        'type',
        'actions',
        'owner',
        'createdAt',
      ],
    };

    return columnOrderMap[senderType].map((key) => baseColumns[key]);
  }, [
    hostOptions,
    platFormOptions,
    emailServerOptions,
    emailResellerOptions,
    typeOptions,
    senderType,
  ]);

  return { columns };
};
