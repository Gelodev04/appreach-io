'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useGetCsvUploads } from 'src/hooks/api/csv-upload';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ICsvUpload } from 'src/types/csv-upload';

import RenderCsvUploadCell from '../csv-upload-cell';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export default function CsvUploadView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const settings = useSettingsContext();

  const { csvUpload, csvUploadLoading } = useGetCsvUploads();

  const [tableData, setTableData] = useState<ICsvUpload[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (csvUpload.length) {
      setTableData(csvUpload);
    }
  }, [csvUpload]);

  const dataFiltered = applyFilter({
    inputData: tableData,
  });

  // const handleDeleteRow = useCallback(
  //   (id: string) => {
  //     const deleteRow = tableData.filter((row) => row.id !== id);

  //     enqueueSnackbar('Delete success!');

  //     setTableData(deleteRow);
  //   },
  //   [enqueueSnackbar, tableData]
  // );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row._id.toString()));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  // const handleEditRow = useCallback(
  //   (id: string) => {
  //     // router.push(paths.dashboard.product.edit(id));
  //   },
  //   [router]
  // );

  // const handleViewRow = useCallback(
  //   (id: string) => {
  //     // router.push(paths.dashboard.product.details(id));
  //   },
  //   // [router]
  //   []
  // );

  const columns: GridColDef[] = [
    {
      field: 'host',
      headerName: 'Host',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="host" />,
    },
    {
      field: 'importName',
      headerName: 'Import name',
      flex: 1,
      minWidth: 240,
      hideable: false,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="importName" />,
    },
    {
      field: 'importSource',
      headerName: 'Import Source',
      width: 160,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="importSource" />,
    },
    {
      field: 'companyCreated',
      headerName: 'Company Created',
      width: 160,
      type: 'singleSelect',
      renderCell: (params) => <RenderCsvUploadCell params={params} type="companyCreated" />,
    },
    {
      field: 'companyUpdated',
      headerName: 'Company Updated',
      width: 140,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="companyUpdated" />,
    },
    {
      field: 'companyIgnored',
      headerName: 'Company Ignored',
      width: 130,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="companyIgnored" />,
    },
    {
      field: 'personCreated',
      headerName: 'Person Updated',
      width: 130,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="personCreated" />,
    },
    {
      field: 'personUpdated',
      headerName: 'Person Updated',
      width: 130,
      editable: true,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="personUpdated" />,
    },
    {
      field: 'errors',
      headerName: 'Errors',
      width: 80,
      editable: true,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="errors" />,
    },
    {
      field: 'dateUploaded',
      headerName: 'Date Updated',
      width: 120,
      editable: true,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="dateUploaded" />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      type: 'singleSelect',
      editable: true,
      renderCell: (params) => <RenderCsvUploadCell params={params} type="status" />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'xl'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Attribute Uploads"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Attribute Uploads',
            },
          ]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.csvUpload.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Upload CSV file
              </Button>
            </Stack>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={csvUploadLoading}
            getRowHeight={() => 'auto'}
            getRowId={(row) => row._id}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: () => (
                <GridToolbarContainer>
                  <GridToolbarQuickFilter />

                  <Stack
                    spacing={1}
                    flexGrow={1}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {!!selectedRowIds.length && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        onClick={confirmRows.onTrue}
                      >
                        Delete ({selectedRowIds.length})
                      </Button>
                    )}

                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                  </Stack>
                </GridToolbarContainer>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData }: { inputData: ICsvUpload[] }) {
  return inputData;
}
