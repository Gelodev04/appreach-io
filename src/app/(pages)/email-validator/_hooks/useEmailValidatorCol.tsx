import { Button, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import Iconify from 'src/components/iconify';
import { RenderCellStatus } from 'src/components/table/render-cell-rows';
import { fDate } from 'src/utils/format-time';
import { EmailRevalidateButton } from '../_components/email-revalidate-button';

export const useEmailValidatorCol = () => {
  const handleDownloadCsv = useCallback((csvUrl?: string) => {
    if (!csvUrl) {
      enqueueSnackbar('No CSV file found', { variant: 'error' });
      return;
    }

    window.open(csvUrl, '_blank');
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'upload.listName',
      headerName: 'List Name',
      minWidth: 200,
      renderCell: (params) => {
        return params.row.upload.listName;
      },
    },
    {
      field: 'hostName',
      headerName: 'Assigned Profile',
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'download.csvDownload',
      headerName: 'CSV',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Download CSV" placement="top">
            <Button
              startIcon={<Iconify icon="eos-icons:csv-file" width={18} />}
              onClick={() => handleDownloadCsv(params.row.download?.csvDownload)}
              size="small"
              sx={{ zIndex: 20, px: 1 }}
            >
              Download
            </Button>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: 'download.unique_emails',
      headerName: 'Emails',
      type: 'number',
      minWidth: 130,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.download.unique_emails;
      },
    },
    {
      field: 'download.verified',
      headerName: 'Valid',
      type: 'number',
      minWidth: 130,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.download.verified;
      },
    },
    {
      field: 'download.catch_all',
      headerName: 'Catch All',
      type: 'number',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.download.catch_all;
      },
    },
    {
      field: 'download.invalid',
      headerName: 'Invalid',
      type: 'number',
      minWidth: 130,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.download.invalid;
      },
    },
    {
      field: 'download.disposable',
      headerName: 'Disposable',
      type: 'number',
      minWidth: 170,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.download.disposable;
      },
    },
    {
      field: 'download.unknown',
      headerName: 'Unknown',
      type: 'number',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params.row.download.unknown;
      },
    },
    {
      field: 'upload.dateUploaded',
      headerName: 'Uploaded',
      sortable: true,
      minWidth: 190,
      valueGetter: (params) => params.row.upload.dateUploaded,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.upload.dateUploaded)}</Typography>;
      },
      type: 'date',
    },
    {
      field: 'archived',
      headerName: 'Actions',
      renderCell: () => <EmailRevalidateButton />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
    },
  ];

  return { columns };
};
