'use client';

import { TabPanel } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Card } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { GridRowsProp } from '@mui/x-data-grid';
import * as React from 'react';
import { HostOptionsType, PlatformOptionsType } from 'src/types/dropdown-types';
import TabTitle from '../../senders/verified-senders/_components/tabs/tab-title';
import { EventSendersTable } from './event-senders-table';

export const EventSendersTab = ({
  rows,
  hostOptions,
  platFormOptions,
  emailServerOptions,
  emailResellerOptions,
  typeOptions,
}: {
  rows: GridRowsProp;
  hostOptions: HostOptionsType;
  platFormOptions: PlatformOptionsType;
  emailServerOptions: PlatformOptionsType;
  emailResellerOptions: PlatformOptionsType;
  typeOptions: PlatformOptionsType;
}) => {
  const [value, setValue] = React.useState('email');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        mt: 3,
        height: '100%',
      }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            textColor="primary"
            onChange={handleChange}
            indicatorColor="primary"
            variant="fullWidth"
            aria-label="Event Senders Tab"
            TabIndicatorProps={{ sx: { backgroundColor: '#003087' } }}
          >
            <Tab label={<TabTitle title="Email" icon="ic:baseline-email" />} value="email" />
            <Tab label={<TabTitle title="LinkedIn" icon="mdi:linkedin" />} value="linkedin" />
            <Tab label={<TabTitle title="CRM" icon="fa-solid:user-cog" />} value="crm" />
          </TabList>
        </Box>
        <TabPanel value={value} sx={{ p: 0, height: '100%' }}>
          {value === 'email' && (
            <EventSendersTable
              rows={rows}
              platFormOptions={platFormOptions}
              hostOptions={hostOptions}
              emailServerOptions={emailServerOptions}
              emailResellerOptions={emailResellerOptions}
              typeOptions={typeOptions}
              senderType="email"
            />
          )}
          {value === 'linkedin' && (
            <EventSendersTable
              rows={rows}
              platFormOptions={platFormOptions}
              hostOptions={hostOptions}
              emailServerOptions={emailServerOptions}
              emailResellerOptions={emailResellerOptions}
              typeOptions={typeOptions}
              senderType="linkedin"
            />
          )}
          {value === 'crm' && (
            <EventSendersTable
              rows={rows}
              platFormOptions={platFormOptions}
              hostOptions={hostOptions}
              emailServerOptions={emailServerOptions}
              emailResellerOptions={emailResellerOptions}
              typeOptions={typeOptions}
              senderType="crm"
            />
          )}
        </TabPanel>
      </TabContext>
    </Card>
  );
};
