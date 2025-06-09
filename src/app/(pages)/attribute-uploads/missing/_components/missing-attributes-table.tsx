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
import { useMemo, useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import { HostOptionsType } from 'src/types/dropdown-types';
import { useMissingAttributesCol } from '../_hooks/useMissingAttributesCol';
import { useMissingAttributesHostStore } from '../_hooks/useMissingAttributesHostStore';
import { useStickyPinnedColumn } from '../_hooks/useStickyPinnedColumn';
import { MissingAttributesFilter } from './missing-attributes-filter';

export const MissingAttributesTable = ({
  rows,
  attributeType,
  lastCol,
  customStyle,
  hostOptions,
  hostCounts,
}: {
  rows: GridRowsProp;
  attributeType: 'person' | 'company';
  lastCol: number;
  customStyle: SxProps<Theme>;
  hostOptions: HostOptionsType;
  hostCounts: Record<string, number>;
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useMissingAttributesCol(attributeType);
  useStickyPinnedColumn(lastCol);

  const { hostName } = useMissingAttributesHostStore(attributeType);

  const filteredRows = useMemo(() => {
    if (!hostName) return rows;
    return rows.filter((row) => row.host_name === hostName);
  }, [rows, hostName]);

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
          <MissingAttributesFilter
            attributeType={attributeType}
            hostOptions={hostOptions}
            hostCounts={hostCounts}
          />
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
        rows={filteredRows}
        slots={slots}
        columnVisibilityModel={{
          host_name: false,
        }}
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
