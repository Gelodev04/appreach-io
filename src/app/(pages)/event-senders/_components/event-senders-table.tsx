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

    // Custom pinning styles:
    '& .MuiDataGrid-columnHeaders': {
      '& .MuiDataGrid-columnHeadersInner': {
        transform: 'none !important',
        '& div': {
          '& .MuiDataGrid-columnHeader:nth-child(1)': {
            position: 'sticky',
            left: 0,
            backgroundColor: '#F4F6F8',
            zIndex: 20,
          },
          '& .MuiDataGrid-columnHeader:nth-child(2)': {
            position: 'sticky',
            left: 50,
            backgroundColor: '#F4F6F8',
            borderRight: '1px solid #E0E0E0',
            zIndex: 5,
          },
        },
      },
    },
  });

  useEffect(() => {
    const handleScrollHorizontal = () => {
      const scroller = document.querySelector('.MuiDataGrid-virtualScroller');
      if (!scroller) return;

      const { scrollLeft } = scroller;

      const headers = document.querySelectorAll('.MuiDataGrid-columnHeader');

      headers.forEach((header, index) => {
        const el = header as HTMLElement;

        // Don't transform the first (checkbox) and second (Sender Name) columns
        if (index === 0 || index === 1) {
          el.style.transform = 'none';
        } else {
          el.style.transform = `translate3d(-${scrollLeft}px, 0px, 0px)`;
        }
      });
    };

    const findVirtualScroller = () => {
      const virtualScrollerElement = document.querySelector('.MuiDataGrid-virtualScroller');
      if (!virtualScrollerElement) {
        setTimeout(findVirtualScroller, 100);
      } else {
        virtualScrollerElement.addEventListener('scroll', handleScrollHorizontal);
        return () => {
          virtualScrollerElement.removeEventListener('scroll', handleScrollHorizontal);
        };
      }
    };

    findVirtualScroller();
  }, []);

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
