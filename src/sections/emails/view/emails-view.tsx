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

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetEmails } from 'src/app/api/emails';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IEmail } from 'src/types/emails';

import RenderEmailCell from '../email-cell';
import EmailTestRowDialog from '../email-test-row-dialog';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
];

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

// ----------------------------------------------------------------------

export default function EmailsView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const openTest = useBoolean(false);

  const settings = useSettingsContext();

  const { seeds, seedsLoading } = useGetEmails();

  const [tableData, setTableData] = useState<IEmail[]>([]);

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
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  // const handleEditRow = useCallback(
  //   (id: string) => {
  //     // router.push(paths.dashboard.product.edit(id));
  //   },
  //   [router]
  // );

  const handleViewRow = useCallback(
    (id: string) => {
      // router.push(paths.dashboard.product.details(id));
    },
    // [router]
    []
  );

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 300,
      hideable: false,
      renderCell: (params) => <RenderEmailCell params={params} type="email" />,
    },
    {
      field: 'host',
      headerName: 'Host',
      flex: 1,
      minWidth: 160,
      hideable: false,
      renderCell: (params) => <RenderEmailCell params={params} type="host" />,
    },
    {
      field: 'server',
      headerName: 'Server',
      width: 160,
      renderCell: (params) => <RenderEmailCell params={params} type="server" />,
    },
    {
      field: 'inboxPlacement',
      headerName: 'Inbox Placement',
      width: 160,
      renderCell: (params) => <RenderEmailCell params={params} type="inboxPlacement" />,
    },
    {
      field: 'inboxEngagement',
      headerName: 'Inbox Engagement',
      width: 160,
      renderCell: (params) => <RenderEmailCell params={params} type="inboxEngagement" />,
    },
    {
      field: 'placementAccount',
      headerName: 'Placement Account',
      width: 160,
      renderCell: (params) => <RenderEmailCell params={params} type="placementAccount" />,
    },
    {
      field: 'engagementAccount',
      headerName: 'Engagement Account',
      width: 160,
      renderCell: (params) => <RenderEmailCell params={params} type="engagementAccount" />,
    },
    {
      field: 'inboxReset',
      headerName: 'Inbox Reset',
      width: 120,
      renderCell: (params) => <RenderEmailCell params={params} type="inboxReset" />,
    },
    {
      field: 'relayAccount',
      headerName: 'Relay Account',
      width: 120,
      renderCell: (params) => <RenderEmailCell params={params} type="relayAccount" />,
    },
    {
      field: 'vpsName',
      headerName: 'VPS Name',
      width: 160,
      renderCell: (params) => <RenderEmailCell params={params} type="vpsName" />,
    },
    {
      field: 'smtp',
      headerName: 'SMTP',
      width: 80,
      renderCell: (params) => <RenderEmailCell params={params} type="smtp" />,
    },
    {
      field: 'imap',
      headerName: 'IMAP',
      width: 80,
      renderCell: (params) => <RenderEmailCell params={params} type="imap" />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 80,
      type: 'singleSelect',
      editable: true,
      valueOptions: STATUS_OPTIONS,
      renderCell: (params) => <RenderEmailCell params={params} type="status" />,
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
          icon={<Iconify icon="fluent-emoji-high-contrast:test-tube" />}
          label="Test"
          onClick={openTest.onTrue}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="bxs:edit" />}
          label="Edit"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
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
          heading="Email accounts"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Emails',
            },
          ]}
          action={
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <Button
                // component={RouterLink}
                // href={paths.dashboard.seeds.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Add email account to host
              </Button>
              <Button
                component={RouterLink}
                href={paths.dashboard.emails.addEmailsBulk}
                startIcon={<Iconify icon="mdi:email-multiple" />}
              >
                Add emails in bulk
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

      <EmailTestRowDialog open={openTest.value} handleClose={openTest.onFalse} />

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

function applyFilter({ inputData }: { inputData: IEmail[] }) {
  return inputData;
}
