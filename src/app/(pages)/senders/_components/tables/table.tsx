'use client';

import { Button, Card, Stack } from '@mui/material';
import {
  DataGrid,
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
import { useTableColumns } from '../hooks/userTableColumns';

const Table = ({
  rows,
  options,
  action = 'both',
  type,
}: {
  rows: GridRowsProp;
  options: {
    profile: string;
    id: string;
  }[];
  action?: 'delete' | 'edit' | 'both';
  type: 'unverified' | 'verified';
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useTableColumns({ action, options, type });

  return (
    <Card
      sx={{
        height: { xs: 800, md: 2 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        minHeight: '70vh',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
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
    </Card>
  );
};

export default Table;
