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
      minWidth: 130,
    },
    {
      field: 'importName',
      headerName: 'Import name',
      minWidth: 250,
      flex: 1,
    },
    {
      field: 'csvLink',
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
              onClick={() => handleDownloadCsv(params?.row?.csvLink)}
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
      field: 'results.person.total',
      headerName: 'Person Attributes',
      type: 'number',
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.results?.person?.total;
      },
    },
    {
      field: 'results.company.total',
      headerName: 'Company Attributes',
      type: 'number',
      minWidth: 220,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.results?.company?.total;
      },
    },
    {
      field: 'results.errors',
      headerName: 'Errors',
      type: 'number',
      minWidth: 140,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.results?.errors;
      },
    },
    {
      field: 'importSource',
      headerName: 'Import Source',
      minWidth: 140,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      type: 'number',
      minWidth: 150,
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => <AttributesUploadsButton />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
    },

    {
      field: 'dateUploaded',
      headerName: 'Date Uploaded',
      sortable: true,
      minWidth: 190,
      valueGetter: (params) => params?.row?.dateUploaded,
      renderCell: (params) => {
        return <Typography>{fDate(params?.row?.dateUploaded)}</Typography>;
      },
      type: 'date',
    },
  ];

  return { columns };
};
