import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { CopyTextRecord } from '../tables/copy-text-record';
import Reverify from '../buttons/reverify';
import DeleteSender from '../buttons/delete';

export default function AccordDetails({ id, txtRecord }: { id: string; txtRecord: string | null }) {
  const columns: GridColDef[] = [
    { field: 'type', headerName: 'Type', sortable: false },
    { field: 'host', headerName: 'Host', sortable: false },
    {
      field: 'txtRecord',
      headerName: 'Value',
      sortable: false,
      flex: 1,
      renderCell: ({ value, row }) => (
        <Box display="flex" sx={{ borderRadius: 0 }}>
          <CopyTextRecord txtRecord={value} />,
          <Reverify tooltipText="Resend domain verification." type="domain" id={row.id} />
          <DeleteSender tooltipText="Delete domain." type="domain" id={row.id} />
        </Box>
      ),
    },
  ];

  const rows = [{ id, type: 'TXT', host: '@', txtRecord }];
  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooterPagination
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        disableEval
        disableVirtualization
        autoHeight
        sx={{
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
            outline: 'none !important',
          },
          '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },
        }}
      />
    </Box>
  );
}
