import { SxProps, Theme } from '@mui/material';

export const EventSendersStyle: SxProps<Theme> = (theme) => ({
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
