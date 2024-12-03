'use client';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ReactNode } from 'react';
import { Card } from '@mui/material';
import TabPanel from './tab-panel';
import useTabsIndex from '../hooks/useTabsIndex';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function SendersVerificationTable({
  verifiedTabs,
  unverifiedSenders,
  archivedTab,
}: {
  verifiedTabs: ReactNode;
  unverifiedSenders: ReactNode;
  archivedTab: ReactNode;
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
          <Tab label="Verified" {...a11yProps(0)} sx={{ fontSize: 16 }} />
          <Tab label="Unverified" {...a11yProps(1)} sx={{ fontSize: 16 }} />
          <Tab label="Archived" {...a11yProps(2)} sx={{ fontSize: 16 }} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        {verifiedTabs}
      </TabPanel>

      <TabPanel value={value} index={1} dir={theme.direction}>
        {unverifiedSenders}
      </TabPanel>

      <TabPanel value={value} index={2} dir={theme.direction}>
        {archivedTab}
      </TabPanel>
    </Card>
  );
}
