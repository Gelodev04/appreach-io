'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
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
import { hosts } from '@prisma/client';
import { useCallback, useState } from 'react';
import { DeleteProfileButton } from 'src/app/(pages)/profiles/_components/delete-profile-button';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { useSnackbar } from 'src/components/snackbar';
import { RenderCellText } from 'src/components/table/render-cell-rows';
import { useBoolean } from 'src/hooks/use-boolean';
import { deleteUserHost } from 'src/services/db/hosts';
import HostAddExistingHost from '../host-add-existing-host';
import { HostNewAccountProfile } from '../host-new-account-profile';
import { RenderLookerStudioUrl, SeedActionCells } from '../host-table-row';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

type THostListView = {
  numOfProfileAssigned: number;
  numOfProfileUsed: number;
  isAllProfileUsed: boolean;
  userHosts: hosts[];
};

export const HostListView = ({
  numOfProfileAssigned,
  numOfProfileUsed,
  isAllProfileUsed,
  userHosts,
}: THostListView) => {
  const { enqueueSnackbar } = useSnackbar();
  const confirmRows = useBoolean();
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteUserHost(selectedRowIds as string[]);
      enqueueSnackbar('Items deleted', { variant: 'warning' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, selectedRowIds]);

  const columns: GridColDef[] = [
    {
      field: 'host',
      headerName: 'Name',
      hideable: false,
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.host} />;
      },
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'lookerStudio',
      headerName: 'Profile Report',
      type: 'singleSelect',
      renderCell: (params) => <RenderLookerStudioUrl params={params} />,
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 160,
    },
    {
      type: 'actions',
      field: 'seeds',
      headerName: 'Settings',
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => <SeedActionCells params={params} />,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'hostCrypt',
      headerName: 'Crypt',
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.hostCrypt} />;
      },
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'ownerName',
      headerName: 'Owner',
      renderCell: (params) => {
        return <RenderCellText displayValue={params.row?.ownerName} />;
      },
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <DeleteProfileButton
            id={params?.row?.id}
            name={params?.row?.host}
            isOwner={params.row.isOwner}
          />
        );
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      flex: 1,
      minWidth: 120,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Account Profiles"
          links={[{ name: 'Account Profiles' }]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <HostAddExistingHost isAllSenderProfilesUsed={isAllProfileUsed} />
              {/* 
              <Button
                onClick={handleClickAddNewAccountProfile}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add new account profile
              </Button> */}
              <HostNewAccountProfile isAllProfileUsed={isAllProfileUsed} />
            </Stack>
          }
        />

        <ItemUsageDisplay
          itemName="Profiles"
          used={numOfProfileUsed}
          limit={numOfProfileAssigned}
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
            disableRowSelectionOnClick
            rows={userHosts}
            columns={columns}
            loading={false}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
            sx={{ '& .MuiTablePagination-root': { display: 'flex' } }}
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
};
