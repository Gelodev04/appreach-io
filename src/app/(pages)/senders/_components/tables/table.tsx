'use client';

import { Button, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridRowsProp,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import EmptyContent from 'src/components/empty-content';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import EditDeleteAction from './edit-delete';

const Table = ({
  rows,
  action = 'both',
}: {
  rows: GridRowsProp;
  action?: 'delete' | 'edit' | 'both';
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'assignedProfile',
      headerName: 'Assigned Profile',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        // TODO: Need to fix  this
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [state, setstate] = useState(params.value);
        const handleChange = (e: SelectChangeEvent<any>) => {
          setstate(e.target.value);
        };
        return (
          <Select
            value={state}
            onChange={handleChange}
            style={{ width: '70%', marginTop: 10, marginBottom: 10 }}
          >
            <MenuItem value="Active">profile_123</MenuItem>
            <MenuItem value="Inactive">profile_143</MenuItem>
            <MenuItem value={params.value}>{params.value}</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: () => <EditDeleteAction action={action} />,
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={rows}
      columns={columns}
      checkboxSelection
      getRowHeight={() => 'auto'}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectedRowIds(newSelectionModel);
      }}
      sx={{
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
          outline: 'none !important',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
          outline: 'none !important',
        },
      }}
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
    />
  );
};

export default Table;
