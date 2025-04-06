'use client';

import { Box, Card, Stack, SxProps, Theme } from '@mui/material';
import {
  DataGrid,
  GridInitialState,
  GridRowSelectionModel,
  GridRowsProp,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import { useSmartleadCol } from '../_hooks/useSmartleadCol';
import { MultipleHostEdit } from './multiple-host-edit';

type OptionType = {
  profile: string;
  id: string;
}[];

export const SmartleadTable = ({ rows, options }: { rows: GridRowsProp; options: OptionType }) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useSmartleadCol(options);

  const sx: SxProps<Theme> = {
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
    },
    '& .MuiTablePagination-root': { display: 'flex' },
  };
  const initialState: GridInitialState = {
    pagination: {
      paginationModel: { pageSize: 25 },
    },
    sorting: {
      sortModel: [{ field: 'lastUpdated', sort: 'desc' }],
    },
  };

  const slots = {
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
            <Box>
              <MultipleHostEdit selectedRowIds={selectedRowIds} options={options} />
            </Box>
          )}
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
        </Stack>
      </GridToolbarContainer>
    ),
    noRowsOverlay: () => <EmptyContent title="No Data" />,
    noResultsOverlay: () => <EmptyContent title="No results found" />,
  };

  return (
    <Card
      sx={{
        height: { xs: 800, md: 2 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
      }}
    >
      <DataGrid
        sx={sx}
        rows={rows}
        slots={slots}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        initialState={initialState}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        onRowSelectionModelChange={setSelectedRowIds}
      />
    </Card>
  );
};
