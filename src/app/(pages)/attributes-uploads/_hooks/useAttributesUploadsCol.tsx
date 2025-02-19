import { Button, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import Iconify from 'src/components/iconify';
import { RenderCellStatus } from 'src/components/table/render-cell-rows';
import { fDate } from 'src/utils/format-time';
import { AttributesUploadsButton } from '../_components/attributes-uploads-button';

export const useAttributesUploadsCol = () => {
  const handleDownloadCsv = useCallback((csvUrl?: string) => {
    if (!csvUrl) {
      enqueueSnackbar('No CSV file found', { variant: 'error' });
      return;
    }

    window.open(csvUrl, '_blank');
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'hostName',
      headerName: 'Host',
      flex: 1,
    },
    {
      field: 'importName',
      headerName: 'Import name',
      flex: 1,
    },
    {
      field: 'csvLink',
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
              onClick={() => handleDownloadCsv(params?.row?.csvLink)}
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
      field: 'results.person.total',
      headerName: 'Person Attributes',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.results?.person?.total;
      },
      flex: 1,
    },
    {
      field: 'results.company.total',
      headerName: 'Company Attributes',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.results?.company?.total;
      },
      flex: 1,
    },
    {
      field: 'results.errors',
      headerName: 'Errors',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.results?.errors;
      },
      flex: 1,
    },
    {
      field: 'importSource',
      headerName: 'Import Source',
      headerAlign: 'left',
      align: 'left',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => <RenderCellStatus params={params} />,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => <AttributesUploadsButton />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
    },

    {
      field: 'dateUploaded',
      headerName: 'Date Uploaded',
      sortable: true,
      valueGetter: (params) => params?.row?.dateUploaded,
      renderCell: (params) => {
        return <Typography>{fDate(params?.row?.dateUploaded)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
  ];

  return { columns };
};
