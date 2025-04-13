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
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { useEmailEventsCol } from '../_hooks/useEmailEventsCol';
import { EditMultipleEmailEvents } from './edit-multiple-email-events';

export const EmailEventsTable = ({
  rows,
  hostOptions,
  platFormOptions,
  emailServerOptions,
  emailResellerOptions,
}: {
  rows: GridRowsProp;
  hostOptions: HostOptionsType;
  platFormOptions: PlatformOptionsType;
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useEmailEventsCol(
    hostOptions,
    platFormOptions,
    emailServerOptions,
    emailResellerOptions
  );

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
              <EditMultipleEmailEvents
                selectedRowIds={selectedRowIds}
                hostOptions={hostOptions}
                platformOptions={platFormOptions}
                emailServerOptions={emailServerOptions}
                emailResellerOptions={emailResellerOptions}
              />
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
