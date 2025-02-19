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
      renderCell: (params) => {
        return params.row.upload.listName;
      },
      flex: 1,
    },
    {
      field: 'hostName',
      headerName: 'Assigned Profile',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => <RenderCellStatus params={params} />,
      flex: 1,
    },
    {
      field: 'download.csvDownload',
      headerName: 'CSV',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Download CSV" placement="top">
            <Button
              startIcon={<Iconify icon="eos-icons:csv-file" width={18} />}
              onClick={() => handleDownloadCsv(params?.row?.download?.csvDownload)}
              size="small"
              sx={{ zIndex: 20, px: 1 }}
            >
              Download
            </Button>
          </Tooltip>
        </Stack>
      ),
      flex: 1,
    },
    {
      field: 'download.unique_emails',
      headerName: 'Emails',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.download?.unique_emails;
      },
      flex: 1,
    },
    {
      field: 'download.verified',
      headerName: 'Valid',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.download?.verified;
      },
      flex: 1,
    },
    {
      field: 'download.catch_all',
      headerName: 'Catch All',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.download?.catch_all;
      },
      flex: 1,
    },
    {
      field: 'download.invalid',
      headerName: 'Invalid',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.download?.invalid;
      },
      flex: 1,
    },
    {
      field: 'download.disposable',
      headerName: 'Disposable',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.download?.disposable;
      },
      flex: 1,
    },
    {
      field: 'download.unknown',
      headerName: 'Unknown',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.download?.unknown;
      },
      flex: 1,
    },
    {
      field: 'upload.dateUploaded',
      headerName: 'Uploaded',
      sortable: true,
      valueGetter: (params) => params.row.upload.dateUploaded,
      renderCell: (params) => {
        return <Typography>{fDate(params.row.upload.dateUploaded)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
    {
      field: 'archived',
      headerName: 'Actions',
      renderCell: () => <EmailRevalidateButton />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },
  ];

  return { columns };
};
