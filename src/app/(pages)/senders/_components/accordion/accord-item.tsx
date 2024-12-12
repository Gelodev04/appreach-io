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
import React from 'react';
import { VerifiedValue } from '../hooks/useSenderEmailsCol';

type AccordItemType = {
  id: string;
  domain: string;
  textRecord: string | null;
  verified: boolean;
  hostId: string;
};

export default function AccordItem({ domain, hostId, id, textRecord, verified }: AccordItemType) {
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
          <Typography sx={{ flex: 1 }} fontSize={18}>
            {domain}
          </Typography>
          <Box display="flex" paddingRight={2}>
            <Tooltip
              title={verified ? 'This  domain is verified.' : 'This domain is unverified.'}
              placement="top-start"
            >
              <Icon
                icon={verified ? 'material-symbols:verified-rounded' : 'material-symbols:error'}
                color={theme.palette.primary.lighter}
                width={24}
              />
            </Tooltip>
          </Box>
          <Button
            variant={verified ? 'outlined' : 'contained'}
            color="primary"
            sx={{ minWidth: 100 }}
          >
            {verified ? 'Verified' : 'Verify'}
          </Button>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
        amet blandit leo lobortis eget.
      </AccordionDetails>
    </Accordion>
  );
}
