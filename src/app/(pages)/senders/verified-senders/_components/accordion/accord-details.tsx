import { Box, Divider } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

import Reverify from '../buttons/reverify';
import DeleteSender from '../buttons/delete';
import { CopyTextRecord } from '../buttons/copy-text-record';
import AssignedProfileDropdown from '../tables/assigned-profile-dd';

type AccordDetailsType = {
  id: string;
  txtRecord: string | null;
  hostId: string;
  options: {
    profile: string;
    id: string;
  }[];
};

export default function AccordDetails({ id, txtRecord, options, hostId }: AccordDetailsType) {
  const columns: GridColDef[] = [
    { field: 'type', headerName: 'Type', sortable: false },
    { field: 'host', headerName: 'Host', sortable: false },
    {
      field: 'hostId',
      headerName: 'Assigned Profile',
      flex: 1,
      renderCell: (params) => (
        <AssignedProfileDropdown params={params} options={options} type="domain" />
      ),
    },
    {
      field: 'txtRecord',
      headerName: 'Value',
      sortable: false,
      flex: 2,
      renderCell: ({ value, row }) => (
        <Box display="flex" sx={{ borderRadius: 0 }}>
          <CopyTextRecord txtRecord={value} />
          <Divider orientation="vertical" variant="middle" flexItem />
          <Reverify tooltipText="Resend domain verification." type="domain" id={row.id} />
          <Divider orientation="vertical" variant="middle" flexItem />
          <DeleteSender tooltipText="Delete domain." type="domain" id={row.id} />
        </Box>
      ),
    },
  ];

  const rows = [{ id, type: 'TXT', host: '@', txtRecord, hostId }];
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
        rowHeight={65}
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
