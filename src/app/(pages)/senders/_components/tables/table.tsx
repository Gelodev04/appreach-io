import { MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import EditDeleteAction from './edit-delete';

const Table = ({
  rows,
  action = 'both',
}: {
  rows: GridRowsProp;
  action?: 'delete' | 'edit' | 'both';
}) => {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'assignedProfile',
      headerName: 'Assigned Profile',
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Select value={params.value} style={{ width: '70%', marginTop: 10, marginBottom: 10 }}>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value={params.value}>{params.value}</MenuItem>
          </Select>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: () => <EditDeleteAction action={action} />,
    },
  ];

  return (
    <DataGrid
      sx={{
        '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
          outline: 'none !important',
        },
        '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
          outline: 'none !important',
        },
      }}
      checkboxSelection
      columns={columns}
      getRowHeight={() => 'auto'}
      rows={rows}
      autoHeight
    />
  );
};

export default Table;
