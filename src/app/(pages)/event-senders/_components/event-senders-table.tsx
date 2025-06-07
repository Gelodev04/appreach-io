'use client';

import { Box, Card, Stack } from '@mui/material';
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
import { useEventSendersStore } from 'src/store/event-senders';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import { EventSendersStyle } from '../_constants/style';
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
  senderType,
}: {
  rows: GridRowsProp;
  hostOptions: HostOptionsType;
  platFormOptions: PlatformOptionsType;
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
  typeOptions: PlatformOptionsType;
  senderType: 'email' | 'linkedin' | 'crm';
}) => {
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { columns } = useEventSendersCol(
    hostOptions,
    platFormOptions,
    emailServerOptions,
    emailResellerOptions,
    typeOptions,
    senderType
  );

  const filteredRows = useFilteredEventSenderRows(rows);
  const { setFilter } = useEventSendersStore();

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

  useEffect(() => {
    setFilter('type', senderType);
  }, [senderType, setFilter]);

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
        height: { xs: 800 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        minHeight: '100%',
        minWidth: 730,
      }}
    >
      <DataGrid
        sx={EventSendersStyle}
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
