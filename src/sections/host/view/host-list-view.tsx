'use client';

import { ObjectId } from 'mongodb';
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
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useGetHosts } from 'src/hooks/api/host';
import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/swr';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IHost } from 'src/types/host';

import HostAddExistingHost from '../host-add-existing-host';
import { RenderHostName, RenderHostCrypt, RenderLookerStudioUrl } from '../host-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export default function HostListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const router = useRouter();

  const settings = useSettingsContext();

  const { hosts, hostsLoading } = useGetHosts();

  const [tableData, setTableData] = useState<IHost[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    setTableData(hosts);
  }, [hosts]);

  const dataFiltered = applyFilter({
    inputData: tableData,
  });

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(endpoints.host.delete, {
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
        enqueueSnackbar('Error deleting item', { variant: 'error' });
      }
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await fetch(endpoints.host.delete, {
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

  const handleEditRow = useCallback(
    (id: ObjectId) => {
      router.push(paths.dashboard.host.edit(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'host',
      headerName: 'Host',
      flex: 1,
      minWidth: 220,
      hideable: false,
      renderCell: (params) => <RenderHostName params={params} />,
    },
    {
      field: 'hostCrypt',
      headerName: 'Host crypt',
      width: 220,
      renderCell: (params) => <RenderHostCrypt params={params} />,
    },
    {
      field: 'lookerStudio',
      headerName: 'Looker Studio URL',
      width: 160,
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <RenderLookerStudioUrl params={params} />,
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
          icon={<Iconify icon="flowbite:edit-outline" />}
          label="Edit"
          onClick={() => handleEditRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="ph:trash-bold" />}
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
        maxWidth={settings.themeStretch ? false : 'md'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Hosts"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Hosts',
            },
          ]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <HostAddExistingHost />

              <Button
                component={RouterLink}
                href={paths.dashboard.host.new}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add new host
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
            loading={hostsLoading}
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

function applyFilter({ inputData }: { inputData: IHost[] }) {
  return inputData;
}
