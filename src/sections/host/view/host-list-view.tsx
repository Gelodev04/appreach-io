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
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { ItemUsageDisplay } from 'src/components/item-usage-tracker/item-usage-display';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { deleteUserHost } from 'src/services/db/hosts';
import HostAddExistingHost from '../host-add-existing-host';
import { HostNewAccountProfile } from '../host-new-account-profile';
import {
  AttributeActionCells,
  RenderHostCrypt,
  RenderHostName,
  RenderLookerStudioUrl,
  SeedActionCells,
  SmartleadActionCells,
} from '../host-table-row';
import PopupWarningForAllUsedProfiles from '../warning-sender-used-all-profiles';

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
  const router = useRouter();
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
      renderCell: (params) => <RenderHostName params={params} />,
      flex: 1,
    },
    {
      field: 'lookerStudio',
      headerName: 'Reporting',
      type: 'singleSelect',
      renderCell: (params) => <RenderLookerStudioUrl params={params} />,
      flex: 1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Seeds',
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => <SeedActionCells params={params} />,
      flex: 1,
    },
    {
      type: 'actions',
      field: 'attributes',
      headerName: 'Attributes',
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => <AttributeActionCells params={params} />,
      flex: 1,
    },
    {
      type: 'actions',
      field: 'smartlead',
      headerName: 'Smartlead',
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => <SmartleadActionCells params={params} />,
      flex: 1,
    },
    {
      field: 'ownerName',
      headerName: 'Owner',
      flex: 1,
    },
    {
      field: 'hostCrypt',
      headerName: 'Crypt',
      renderCell: (params) => <RenderHostCrypt params={params} />,
      flex: 1,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleClickAddNewAccountProfile = () => {
    if (isAllProfileUsed) {
      enqueueSnackbar({
        message: <PopupWarningForAllUsedProfiles />,
        variant: 'warning',
        persist: true,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top',
        },
      });

      return null;
    }
    router.push(paths.settings.new);
  };

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
