'use client';

import { Card, Stack, SxProps, Theme } from '@mui/material';
import {
  DataGrid,
  GridInitialState,
  GridRowSelectionModel,
  GridRowsProp,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import { useMissingAttributesCol } from '../_hooks/useMissingAttributesCol';
import { useStickyPinnedColumn } from '../_hooks/useStickyPinnedColumn';
export const MissingAttributesTable = ({
  rows,
  attributeType,
  lastCol,
  customStyle,
}: {
  rows: GridRowsProp;
  attributeType: 'person' | 'company';
  lastCol: number;
  customStyle: SxProps<Theme>;
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useMissingAttributesCol(attributeType);
  useStickyPinnedColumn(lastCol);

  const initialState: GridInitialState = {
    pagination: {
      paginationModel: { pageSize: 25 },
    },
    sorting: {
      sortModel: [{ field: 'createdAt', sort: 'desc' }],
    },
  };

  const slots = {
    toolbar: () => (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <Stack
          spacing={2}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <GridToolbarColumnsButton />
        </Stack>
      </GridToolbarContainer>
    ),
    noRowsOverlay: () => <EmptyContent title="No Data" />,
    noResultsOverlay: () => <EmptyContent title="No results found" />,
  };

  return (
    <Card
      sx={{
        height: { xs: 800 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        minHeight: '100%',
        minWidth: 730,
      }}
    >
      <DataGrid
        sx={customStyle}
        rows={rows}
        slots={slots}
        columns={columns}
        disableRowSelectionOnClick
        initialState={initialState}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        onRowSelectionModelChange={setSelectedRowIds}
      />
    </Card>
  );
};
