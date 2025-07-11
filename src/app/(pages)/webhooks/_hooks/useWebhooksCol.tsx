import { Button, Stack, Tooltip } from '@mui/material';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { RenderCellText } from 'src/components/table/render-cell-rows';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { ProductLink } from '../_components/product-link';
import { DisconnectNoticeSwitch } from '../_components/disconnect-notice-switch';

export const useWebhooksCol = (
  token?: string | null,
  notifyOnDisconnect?: Record<string, boolean>
) => {
  const { copy } = useCopyToClipboard();

  const handleCopyUrl = (params: GridCellParams) => {
    if (!token) {
      enqueueSnackbar({ variant: 'warning', message: 'You do not have a token' });
      return;
    }
    const webhookUrl = `https://webhooks.outreachmagic.io/${params.row.value}?token=${token}`;
    copy(webhookUrl);
    enqueueSnackbar('Copied to clipboard');
  };

  const columns: GridColDef[] = [
    {
      field: 'display',
      headerName: 'Product',
      renderCell: (params) => <ProductLink params={params} />,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'About',
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.description} />;
      },
      flex: 1,
    },
    {
      field: 'value',
      headerName: 'Events Webhook',
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Copy url" placement="top">
            <Button
              onClick={() => handleCopyUrl(params)}
              sx={{ zIndex: 20, color: '#637381' }}
              startIcon={<Iconify icon="uil:copy" />}
            >
              Copy Webhook URL
            </Button>
          </Tooltip>
        </Stack>
      ),
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'disconnect_notice',
      headerName: 'Disconnect Notification',
      renderCell: (params) => {
        const isEnabled = notifyOnDisconnect?.[params.row.value] || false;
        return <DisconnectNoticeSwitch value={params.row.value} initialChecked={isEnabled} />;
      },
      flex: 1,
    },
  ];

  return { columns };
};
