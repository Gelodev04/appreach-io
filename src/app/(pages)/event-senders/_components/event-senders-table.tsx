'use client';

import { Box, Card, Stack, SxProps, Theme } from '@mui/material';
import {
  DataGrid,
  GridInitialState,
  GridRowSelectionModel,
  GridRowsProp,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { useEventSendersCol } from '../_hooks/useEventSendersCol';
import { useFilteredEventSenderRows } from '../_hooks/useFilteredEventSenderRows';
import { EditMultipleEventSenders } from './edit-multiple-event-senders';
import { MultipleFilter } from './multiple-filter';

export const EventSendersTable = ({
  rows,
  hostOptions,
  platFormOptions,
  emailServerOptions,
  emailResellerOptions,
  typeOptions,
}: {
  rows: GridRowsProp;
  hostOptions: HostOptionsType;
  platFormOptions: PlatformOptionsType;
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
  typeOptions: PlatformOptionsType;
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useEventSendersCol(
    hostOptions,
    platFormOptions,
    emailServerOptions,
    emailResellerOptions,
    typeOptions
  );

  const filteredRows = useFilteredEventSenderRows(rows);

  const sx: SxProps<Theme> = (theme) => ({
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
    },
    '& .MuiTablePagination-root': { display: 'flex' },

    '& .MuiDataGrid-cell:nth-child(1)': {
      position: 'sticky',
      left: 0,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
    },

    '& .MuiDataGrid-cell:nth-child(2)': {
      position: 'sticky',
      left: 50,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      borderRight: '1px solid #E0E0E0',
    },

    // 1. Selected
    '& .MuiDataGrid-row.Mui-selected': {
      '& .MuiDataGrid-cell:nth-child(1), & .MuiDataGrid-cell:nth-child(2)': {
        backgroundColor: '#EBEFF6',
      },
    },

    // 2. Selected + Hovered
    '& .MuiDataGrid-row.Mui-selected:hover, & .MuiDataGrid-row.Mui-selected.Mui-hovered': {
      '& .MuiDataGrid-cell:nth-child(1), & .MuiDataGrid-cell:nth-child(2)': {
        backgroundColor: '#D6DEEC',
      },
    },

    // 3. Hovered only (not selected)
    '& .MuiDataGrid-row.Mui-hovered:not(.Mui-selected), & .MuiDataGrid-row:hover:not(.Mui-selected)':
      {
        '& .MuiDataGrid-cell:nth-child(1), & .MuiDataGrid-cell:nth-child(2)': {
          backgroundColor: '#F6F7F8',
        },
      },

    '& .MuiDataGrid-columnHeaders': {
      '& .MuiDataGrid-columnHeadersInner': {
        transform: 'none !important',
        '& div': {
          '& .MuiDataGrid-columnHeader:nth-child(1)': {
            backgroundColor: '#F4F6F8',
            zIndex: 5,
          },
          '& .MuiDataGrid-columnHeader.sticky-col-1': {
            backgroundColor: '#F4F6F8',
            zIndex: 2,
          },
        },
      },
    },
  });

  useEffect(() => {
    const scroller = document.querySelector('.MuiDataGrid-virtualScroller');
    const root = document.querySelector('.MuiDataGrid-root'); // or your Card wrapper if more precise

    const handleScrollHorizontal = () => {
      const scrollLeft = scroller?.scrollLeft ?? 0;

      // Add class if scrolled
      if (scrollLeft > 0) {
        root?.classList.add('has-horizontal-scroll');
      } else {
        root?.classList.remove('has-horizontal-scroll');
      }

      // Your existing transform logic
      const headerColumns = document.querySelectorAll('.MuiDataGrid-columnHeader:nth-child(n+3)');
      headerColumns.forEach((col: any) => {
        col.style.transform = `translateX(-${scrollLeft}px)`;
      });
    };

    if (scroller) {
      scroller.addEventListener('scroll', handleScrollHorizontal);
      return () => {
        scroller.removeEventListener('scroll', handleScrollHorizontal);
      };
    }
  }, []);

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
          spacing={2}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Box>
              <EditMultipleEventSenders
                selectedRowIds={selectedRowIds}
                hostOptions={hostOptions}
                platformOptions={platFormOptions}
                emailServerOptions={emailServerOptions}
                emailResellerOptions={emailResellerOptions}
                typeOptions={typeOptions}
              />
            </Box>
          )}
          <GridToolbarColumnsButton />
          <MultipleFilter
            hostOptions={hostOptions}
            platformOptions={platFormOptions}
            emailServerOptions={emailServerOptions}
            emailResellerOptions={emailResellerOptions}
            typeOptions={typeOptions}
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
        height: { xs: 800, md: 2 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
      }}
    >
      <DataGrid
        sx={sx}
        rows={filteredRows}
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
