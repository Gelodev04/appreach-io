'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { useChecklistStore } from 'src/store/checklist-store';

import { seedBatches } from '@prisma/client';
import PopupWarningForAllUsedSeeds from 'src/app/(pages)/seeds/_components/popup-warning-used-seeds';
import { useRouter } from 'next/navigation';
import { deleteSeedsByIds } from 'src/services/db/seeds';
import {
  RenderCellDateAdded,
  RenderCellImportName,
  RenderCellPublish,
  RenderCellResultsTotal,
} from '../seed-table-row';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

type TSeedsView = {
  seeds: seedBatches[];
  numOfSeedsUsed: number;
  numOfSeedsAssigned: number;
  isAllSeedsUsed: boolean;
};

export default function SeedView({
  seeds,
  isAllSeedsUsed,
  numOfSeedsAssigned,
  numOfSeedsUsed,
}: TSeedsView) {
  const { enqueueSnackbar } = useSnackbar();
  const confirmRows = useBoolean();
  const settings = useSettingsContext();
  const { setStepStatus } = useChecklistStore((state) => state);
  const router = useRouter();
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (seeds.length) {
      setStepStatus('step1Finished', true); // Complete step on checklist
    }
  }, [seeds, setStepStatus]);

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteSeedsByIds(selectedRowIds as string[]);

      enqueueSnackbar('Items deleted', { variant: 'warning' });

      /* const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row._id.toString()));

      setTableData(deleteRows); */
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, selectedRowIds]);

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

  const handleClickAddNewSeed = () => {
    if (isAllSeedsUsed) {
      enqueueSnackbar({
        message: <PopupWarningForAllUsedSeeds />,
        variant: 'warning',
        persist: true,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top',
        },
      });

      return null;
    }
    router.push(paths.seed.new);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'List name',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => <RenderCellImportName params={params} />,
    },
    {
      field: 'download',
      headerName: 'CSV',
      width: 120,
      type: 'singleSelect',
      sortable: false,
      filterable: false,
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
    // {
    //   field: 'generate.total',
    //   headerName: 'Generate total',
    //   width: 160,
    //   renderCell: (params) => <RenderCellGenerateTotal params={params} />,
    // },
    {
      field: 'results.total',
      headerName: 'List size',
      width: 160,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellResultsTotal params={params} />,
    },
    // {
    //   field: 'token',
    //   headerName: 'Token',
    //   width: 120,
    //   renderCell: (params) => <RenderCellToken params={params} />,
    // },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      field: 'dateAdded',
      headerName: 'Created on',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderCellDateAdded params={params} />,
    },
  ];
  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Seeds"
          links={[{ name: 'Seeds' }]}
          action={
            <Stack id="generate_seed_btn" direction={{ xs: 'column', md: 'row' }} gap={2}>
              <Button
                onClick={handleClickAddNewSeed}
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
            rows={seeds}
            columns={columns}
            getRowHeight={() => 'auto'}
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
