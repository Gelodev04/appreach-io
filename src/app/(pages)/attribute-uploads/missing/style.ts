import { SxProps, Theme } from '@mui/material';

export const MissingAttributesPersonStyle: SxProps<Theme> = (theme) => ({
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
    outline: 'none !important',
  },
  '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '& .MuiTablePagination-root': { display: 'flex' },

  '& .MuiDataGrid-cell:nth-child(9)': {
    position: 'sticky',
    right: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    borderLeft: '1px solid #E0E0E0',
  },

  // 1. Selected
  '& .MuiDataGrid-row.Mui-selected': {
    '& .MuiDataGrid-cell:nth-child(9)': {
      backgroundColor: '#EBEFF6',
    },
  },

  // 2. Selected + Hovered
  '& .MuiDataGrid-row.Mui-selected:hover, & .MuiDataGrid-row.Mui-selected.Mui-hovered': {
    '& .MuiDataGrid-cell:nth-child(9)': {
      backgroundColor: '#D6DEEC',
    },
  },

  // 3. Hovered only (not selected)
  '& .MuiDataGrid-row.Mui-hovered:not(.Mui-selected), & .MuiDataGrid-row:hover:not(.Mui-selected)':
    {
      '& .MuiDataGrid-cell:nth-child(9)': {
        backgroundColor: '#F6F7F8',
      },
    },

  // Custom pinning styles:
  '& .MuiDataGrid-columnHeaders': {
    '& .MuiDataGrid-columnHeadersInner': {
      transform: 'none !important',
      '& div': {
        '& .MuiDataGrid-columnHeader:nth-child(9)': {
          position: 'sticky',
          backgroundColor: '#F4F6F8',
          borderLeft: '1px solid #E0E0E0',
          zIndex: 20,
        },
      },
    },
  },
});

export const MissingAttributesCompanyStyle: SxProps<Theme> = (theme) => ({
  '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
    outline: 'none !important',
  },
  '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
    outline: 'none !important',
  },
  '& .MuiTablePagination-root': { display: 'flex' },

  '& .MuiDataGrid-cell:nth-child(7)': {
    position: 'sticky',
    right: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    borderLeft: '1px solid #E0E0E0',
  },

  // 1. Selected
  '& .MuiDataGrid-row.Mui-selected': {
    '& .MuiDataGrid-cell:nth-child(7)': {
      backgroundColor: '#EBEFF6',
    },
  },

  // 2. Selected + Hovered
  '& .MuiDataGrid-row.Mui-selected:hover, & .MuiDataGrid-row.Mui-selected.Mui-hovered': {
    '& .MuiDataGrid-cell:nth-child(7)': {
      backgroundColor: '#D6DEEC',
    },
  },

  // 3. Hovered only (not selected)
  '& .MuiDataGrid-row.Mui-hovered:not(.Mui-selected), & .MuiDataGrid-row:hover:not(.Mui-selected)':
    {
      '& .MuiDataGrid-cell:nth-child(7)': {
        backgroundColor: '#F6F7F8',
      },
    },

  // Custom pinning styles:
  '& .MuiDataGrid-columnHeaders': {
    '& .MuiDataGrid-columnHeadersInner': {
      transform: 'none !important',
      '& div': {
        '& .MuiDataGrid-columnHeader:nth-child(7)': {
          position: 'sticky',
          backgroundColor: '#F4F6F8',
          borderLeft: '1px solid #E0E0E0',
          zIndex: 20,
        },
      },
    },
  },
});
