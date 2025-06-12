'use client';

import { Card, Stack } from '@mui/material';
import {
  DataGrid,
  GridInitialState,
  GridRowsProp,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useMemo } from 'react';
import EmptyContent from 'src/components/empty-content';
import { useMissingAttributesFiltersStore } from 'src/store/attribute-uploads';
import { HostOptionsType } from 'src/types/dropdown-types';
import { useMissingAttributesCol } from '../_hooks/useMissingAttributesCol';
import { useStickyPinnedColumn } from '../_hooks/useStickyPinnedColumn';
import { MissingAttributesPersonStyle } from '../style';
import { MissingAttributesFilter } from './missing-attributes-filter';

type MissingAttributesTablePropType = {
  rows: GridRowsProp;
  hostOptions: HostOptionsType;
};

export const MissingAttributesTable = ({ rows, hostOptions }: MissingAttributesTablePropType) => {
  const { columns } = useMissingAttributesCol();
  useStickyPinnedColumn();
  console.log({ rows });
  const profileCounts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const profile = row.host_name || 'Unknown';
        acc[profile] = (acc[profile] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [rows]);

  const { hostName } = useMissingAttributesFiltersStore();

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
    columns: {
      columnVisibilityModel: {
        host_name: false,
      },
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
          <MissingAttributesFilter hostOptions={hostOptions} hostCounts={profileCounts} />
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
        sx={MissingAttributesPersonStyle}
        rows={filteredRows}
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        slots={slots}
        columns={columns}
        disableRowSelectionOnClick
        initialState={initialState}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};
