import { Button, Stack, Tooltip } from '@mui/material';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { ProductLink } from '../_components/product-link';

export const useWebhooksCol = (token?: string | null) => {
  const { copy } = useCopyToClipboard();

  const handleCopyUrl = (params: GridCellParams) => {
    if (!token) {
      enqueueSnackbar({ variant: 'warning', message: 'You do not have a token' });
      return;
    }

    const webhookUrl = params.row.events_webhook.replace('{tokenHash}', token);
    copy(webhookUrl);
    enqueueSnackbar('Copied to clipboard');
  };

  const columns: GridColDef[] = [
    {
      field: 'product',
      headerName: 'Product',
      renderCell: (params) => <ProductLink params={params} />,
      flex: 1,
    },
    {
      field: 'about',
      headerName: 'About',
      flex: 1,
    },
    {
      field: 'events_webhook',
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
  ];

  return { columns };
};
