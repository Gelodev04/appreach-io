'use client';

import { Icon } from '@iconify/react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { CopyTextRecord } from '../tables/copy-text-record';

type AccordItemType = {
  id: string;
  domain: string;
  txtRecord: string | null;
  verified: boolean;
  hostId: string;
};

export default function AccordItem({ domain, hostId, id, txtRecord, verified }: AccordItemType) {
  const columns: GridColDef[] = [
    { field: 'type', headerName: 'Type', sortable: false },
    { field: 'host', headerName: 'Host', sortable: false },
    {
      field: 'txtRecord',
      headerName: 'Value',
      sortable: false,
      flex: 1,
      renderCell: ({ value }) => (
        <Box display="flex">
          <CopyTextRecord txtRecord={value} />,
          <Tooltip title="Resend verification email." placement="top-start">
            <IconButton size="medium">
              <Icon icon="material-symbols:refresh" color={theme.palette.primary.lighter} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete sender email." placement="top-start">
            <IconButton size="medium">
              <Icon icon="material-symbols:delete" color={theme.palette.error.dark} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = [{ id, type: 'TXT', host: '@', txtRecord }];
  const theme = useTheme();
  return (
    <Accordion variant="outlined">
      <AccordionSummary
        expandIcon={
          <IconButton>
            {verified ? (
              <Box sx={{ width: 24 }} />
            ) : (
              <Icon
                icon="material-symbols:keyboard-arrow-down"
                color={theme.palette.primary.main}
              />
            )}
          </IconButton>
        }
        sx={{ height: 20, boxShadow: theme.shadows[1] }}
        disabled={verified}
      >
        <Box display="flex" alignItems="center" sx={{ width: '100%', paddingRight: 5 }}>
          <Typography sx={{ flex: 1 }} fontSize={16}>
            {domain}
          </Typography>
          <Box display="flex" paddingRight={2}>
            <Tooltip
              title={verified ? 'This  domain is verified.' : 'This domain is unverified.'}
              placement="top-start"
            >
              <Icon
                icon={
                  verified
                    ? 'material-symbols:verified-rounded'
                    : 'material-symbols-light:error-outline-rounded'
                }
                color={theme.palette.primary.lighter}
                width={24}
              />
            </Tooltip>
          </Box>
          <Button
            variant={verified ? 'outlined' : 'contained'}
            color="primary"
            sx={{ minWidth: 120 }}
          >
            <Typography fontSize={14}>{verified ? 'Verified' : 'Verify domain'}</Typography>
          </Button>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
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
      </AccordionDetails>
    </Accordion>
  );
}
