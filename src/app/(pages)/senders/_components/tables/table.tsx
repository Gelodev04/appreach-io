'use client';

import { Button, Card, Stack, SxProps, Theme } from '@mui/material';
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
import { useState, useTransition } from 'react';
import Iconify from 'src/components/iconify';
import { deleteSenderAddressById } from 'src/services/db/sender-addresses';
import { useSearchParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

import { useSendersEmailCol } from '../hooks/useSenderEmailsCol';

const Table = ({
  rows,
  options,
  isArchived,
}: {
  rows: GridRowsProp;
  isArchived?: boolean;
  options: {
    profile: string;
    id: string;
  }[];
}) => {
  const params = useSearchParams();
  const tableIndex = params.get('tableIndex');
  const [isPending, startTransition] = useTransition();
  const { columns } = useSendersEmailCol({ options, isArchived });
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const initialState = {
    pagination: {
      paginationModel: { pageSize: 10 },
    },
  };

  const sx: SxProps<Theme> = {
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
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
            <Button
              size="small"
              color="error"
              disabled={isPending}
              onClick={handleDeleteRows}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            >
              {isPending ? `Deleting...` : `Delete (${selectedRowIds.length})`}
            </Button>
          )}
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
        </Stack>
      </GridToolbarContainer>
    ),
    noRowsOverlay: () => <EmptyContent title="No Data" />,
    noResultsOverlay: () => <EmptyContent title="No results found" />,
  };

  const handleDeleteRows = () => {
    startTransition(async () => {
      if (!tableIndex) return undefined;
      const deletedRows = await deleteSenderAddressById(selectedRowIds as string[], tableIndex);
      if (deletedRows) {
        enqueueSnackbar('Successfully Deleted', { variant: 'success' });
      }
    });
  };
  return (
    <Card
      sx={{
        height: { xs: 800, md: 2 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
        minHeight: '70vh',
        minWidth: 730,
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
        pageSizeOptions={[5, 10, 25]}
        onRowSelectionModelChange={setSelectedRowIds}
      />
    </Card>
  );
};

export default Table;
