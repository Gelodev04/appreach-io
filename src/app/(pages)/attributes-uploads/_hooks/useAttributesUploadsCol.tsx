import { Button, Stack, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import Iconify from 'src/components/iconify';
import { RenderCellStatus, RenderCellText } from 'src/components/table/render-cell-rows';
import { fDate } from 'src/utils/format-time';
import { AttributesUploadsButton } from '../_components/attributes-uploads-button';
import { AttributesUploadsImportName } from '../_components/attributes-uploads-import-name';

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
      field: 'host_name',
      headerName: 'Host',
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.host_name} />;
      },
      flex: 1,
    },
    {
      field: 'import_name',
      headerName: 'Import name',
      renderCell: (params) => {
        return <AttributesUploadsImportName params={params} />;
      },
      flex: 1,
    },
    {
      field: 'csv_link',
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
              onClick={() => handleDownloadCsv(params?.row?.csv_link)}
              size="small"
              sx={{ zIndex: 20, px: 1 }}
            >
              Download
            </Button>
          </Tooltip>
        </Stack>
      ),
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'metadata.processing_results.persons.total',
      headerName: 'Person Attributes',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <RenderCellText
            displayValue={params?.row?.metadata?.processing_results?.persons?.total}
          />
        );
      },
      flex: 1,
    },
    {
      field: 'metadata.processing_results.companies.total',
      headerName: 'Company Attributes',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <RenderCellText
            displayValue={params?.row?.metadata?.processing_results?.companies?.total}
          />
        );
      },
      flex: 1,
    },
    {
      field: 'metadata.processing_results.custom.total',
      headerName: 'Custom Attributes',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <RenderCellText displayValue={params?.row?.metadata?.processing_results?.custom?.total} />
        );
      },
      flex: 1,
    },
    {
      field: 'metadata.processing_results.errors',
      headerName: 'Errors',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return <RenderCellText displayValue={params?.row?.metadata?.processing_results?.errors} />;
      },
      flex: 1,
    },
    {
      field: 'metadata.processing_status',
      headerName: 'Status',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return <RenderCellStatus status={params.row.metadata.processing_status} />;
      },
      flex: 1,
      minWidth: 80,
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
      field: 'date_uploaded',
      headerName: 'Date Uploaded',
      sortable: true,
      valueGetter: (params) => params?.row?.date_uploaded,
      renderCell: (params) => {
        return <Typography>{fDate(params?.row?.date_uploaded)}</Typography>;
      },
      type: 'date',
      flex: 1,
    },
  ];

  return { columns };
};
