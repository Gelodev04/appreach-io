import { Button, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { EmailRevalidateButton } from '../_components/email-revalidate-button';
import { RenderCellStatus } from '../_components/email-validator-rows';

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
      hideable: false,
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
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'download.csvDownload',
      headerName: 'CSV',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Download CSV" placement="top">
            <Button
              startIcon={<Iconify icon="eos-icons:csv-file" width={18} />}
              onClick={() => handleDownloadCsv(params.row.results?.csvUrl)}
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
      renderCell: (params) => {
        return params.row.download.unique_emails;
      },
    },
    {
      field: 'download.verified',
      headerName: 'Valid',
      type: 'number',
      renderCell: (params) => {
        return params.row.download.verified;
      },
    },
    {
      field: 'download.catch_all',
      headerName: 'Catch All',
      type: 'number',
      renderCell: (params) => {
        return params.row.download.catch_all;
      },
    },
    {
      field: 'download.invalid',
      headerName: 'Invalid',
      type: 'number',
      renderCell: (params) => {
        return params.row.download.invalid;
      },
    },
    {
      field: 'download.disposable',
      headerName: 'Disposable',
      type: 'number',
      renderCell: (params) => {
        return params.row.download.disposable;
      },
    },
    {
      field: 'download.unknown',
      headerName: 'Unknown',
      type: 'number',
      renderCell: (params) => {
        return params.row.download.unknown;
      },
    },
    {
      field: 'upload.dateUploaded',
      headerName: 'Uploaded',
      sortable: true,
      minWidth: 180,
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
