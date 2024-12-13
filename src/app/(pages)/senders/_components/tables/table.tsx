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
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [isPending, startTransition] = useTransition();
  const params = useSearchParams();
  const tableIndex = params.get('tableIndex');
  const { columns } = useSendersEmailCol({ options, isArchived });
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
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        rowSelection={false}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 25]}
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
        }}
      />
    </Card>
  );
};

export default Table;
