'use client';

import { Card, Divider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ReactNode } from 'react';
import useTabsIndex from '../hooks/useTabsIndex';
import TabPanel from './tab-panel';
import TabTitle from './tab-title';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function SendersTabs({
  activeSenderEmails,
  archivedSenderEmails,
  verifiedDomains,
}: {
  activeSenderEmails: ReactNode;
  archivedSenderEmails: ReactNode;
  verifiedDomains: ReactNode;
}) {
  const theme = useTheme();
  const { handleChange, value } = useTabsIndex();

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        height: '100%',
      }}
    >
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          textColor="primary"
          TabIndicatorProps={{ sx: { backgroundColor: '#003087' } }}
        >
          <Tab
            label={
              <TabTitle
                title="Active Sender Emails"
                icon="material-symbols:mark-email-read-rounded"
              />
            }
            {...a11yProps(0)}
            sx={{ fontSize: 16 }}
          />
          <Tab
            label={<TabTitle title="Archived Sender Emails" icon="material-symbols:archive" />}
            {...a11yProps(1)}
            sx={{ fontSize: 16 }}
          />
          <Tab
            label={<TabTitle title="Verified Domains" icon="mdi:internet" />}
            {...a11yProps(2)}
            sx={{ fontSize: 16 }}
          />
        </Tabs>
      </AppBar>
      <Divider />
      <TabPanel value={value} index={0} dir={theme.direction}>
        {activeSenderEmails}
      </TabPanel>

      <TabPanel value={value} index={1} dir={theme.direction}>
        {archivedSenderEmails}
      </TabPanel>

      <TabPanel value={value} index={2} dir={theme.direction}>
        {verifiedDomains}
      </TabPanel>
    </Card>
  );
}
