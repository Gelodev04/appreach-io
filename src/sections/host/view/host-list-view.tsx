'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnVisibilityModel,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { hosts } from '@prisma/client';
import { deleteUserHost } from 'src/services/db/hosts';
import HostAddExistingHost from '../host-add-existing-host';
import SenderProfileUsed from '../host-sender-profile-used';
import { RenderHostCrypt, RenderHostName, RenderLookerStudioUrl } from '../host-table-row';
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
  const settings = useSettingsContext();
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteUserHost([id]);
        enqueueSnackbar('Item deleted', { variant: 'warning' });
      } catch (error) {
        enqueueSnackbar('Error deleting item', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteUserHost(selectedRowIds as string[]);
      enqueueSnackbar('Items deleted', { variant: 'warning' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, selectedRowIds]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.settings.edit(id.toString()));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'host',
      headerName: 'Infrastructure',
      flex: 1,
      minWidth: 220,
      hideable: false,
      renderCell: (params) => <RenderHostName params={params} />,
    },
    {
      field: 'hostCrypt',
      headerName: 'Crypt',
      width: 220,
      renderCell: (params) => <RenderHostCrypt params={params} />,
    },
    {
      field: 'lookerStudio',
      headerName: 'Reporting URL',
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
          onClick={() => handleEditRow(params.id.toString())}
        />,
        <GridActionsCellItem
          showInMenu
          disabled
          icon={<Iconify icon="ph:trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.id.toString());
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

  const handleClickAddNewSenderProfile = () => {
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
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="Sender Profiles"
          links={[{ name: 'Sender Profiles' }]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <HostAddExistingHost isAllSenderProfilesUsed={isAllProfileUsed} />

              <Button
                onClick={handleClickAddNewSenderProfile}
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add new sender profile
              </Button>
            </Stack>
          }
        />
        <SenderProfileUsed
          numOfProfileAssigned={numOfProfileAssigned}
          numOfProfileUsed={numOfProfileUsed}
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
};
