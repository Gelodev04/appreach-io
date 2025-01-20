'use client';
import { Card, SxProps, Theme } from '@mui/material';
import { DataGrid, GridInitialState, GridRowsProp } from '@mui/x-data-grid';
import { useEmailValidatorCol } from '../_hooks/useEmailValidatorCol';

export const EmailValidatorTable = ({
  rows,
  isAllCreditsUsed,
}: {
  rows: GridRowsProp;
  isAllCreditsUsed: boolean;
}) => {
  const { columns } = useEmailValidatorCol();

  const sx: SxProps<Theme> = {
    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
    },
  };
  const initialState: GridInitialState = {
    pagination: {
      paginationModel: { pageSize: 10 },
    },
    sorting: {
      sortModel: [{ field: 'upload.dateUploaded', sort: 'desc' }],
    },
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
        columns={columns}
        disableRowSelectionOnClick
        initialState={initialState}
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 25]}
      />
    </Card>
  );
};
