'use client';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetSeeds } from 'src/hooks/api/seed';
import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/swr';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { ISeed } from 'src/types/seed';

import {
  RenderCellToken,
  RenderCellPublish,
  RenderCellDateAdded,
  RenderCellImportName,
  RenderCellResultsTotal,
  RenderCellGenerateTotal,
} from '../seed-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export default function SeedView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const settings = useSettingsContext();

  const { seeds, seedsLoading } = useGetSeeds();

  const [tableData, setTableData] = useState<ISeed[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (seeds.length) {
      setTableData(seeds);
    }
  }, [seeds]);

  const dataFiltered = applyFilter({
    inputData: tableData,
  });

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(endpoints.seed.delete, {
          method: 'POST',
          body: JSON.stringify({ ids: [id] }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }

        enqueueSnackbar('Item deleted', { variant: 'warning' });

        const newTableData = tableData.filter((row) => row._id.toString() !== id);

        setTableData(newTableData);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await fetch(endpoints.seed.delete, {
        method: 'POST',
        body: JSON.stringify({ ids: selectedRowIds }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      enqueueSnackbar('Items deleted', { variant: 'warning' });

      const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row._id.toString()));

      setTableData(deleteRows);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleDownloadCsv = useCallback(
    (csvUrl?: string) => {
      if (!csvUrl) {
        enqueueSnackbar('No CSV file found', { variant: 'error' });
        return;
      }

      window.open(csvUrl, '_blank');
    },
    [enqueueSnackbar]
  );

  const columns: GridColDef[] = [
    {
      field: 'dateAdded',
      headerName: 'Date added',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellDateAdded params={params} />,
    },
    {
      field: 'name',
      headerName: 'Import name',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => <RenderCellImportName params={params} />,
    },
    {
      field: 'generate.total',
      headerName: 'Generate total',
      width: 160,
      renderCell: (params) => <RenderCellGenerateTotal params={params} />,
    },
    {
      field: 'results.total',
      headerName: 'Results total',
      width: 160,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellResultsTotal params={params} />,
    },
    {
      field: 'token',
      headerName: 'Token',
      width: 120,
      renderCell: (params) => <RenderCellToken params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Download CSV"
          onClick={() => handleDownloadCsv(params.row.results?.csvUrl)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row._id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
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
          heading="Seeds"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Seeds',
            },
          ]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.seed.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Generate seed list
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
            loading={seedsLoading}
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

function applyFilter({ inputData }: { inputData: ISeed[] }) {
  // Sort the inputData based on the dateAdded field in descending order
  const sortedData = inputData.slice().sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return dateB - dateA; // Sort in descending order
  });

  return sortedData;
}

