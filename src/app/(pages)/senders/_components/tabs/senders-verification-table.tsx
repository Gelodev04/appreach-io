'use client';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ReactNode, Suspense, useState } from 'react';
import { Card, Skeleton } from '@mui/material';
import TabPanel from './tab-panel';
import { UnverifiedTable, VerifiedTable } from '../tables';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function SendersVerificationTable({
  verified,
  unverifiedEmails,
  unverifiedDomains,
}: {
  verified: ReactNode;
  unverifiedEmails: ReactNode;
  unverifiedDomains: ReactNode;
}) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
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
          <Tab label="Unverified Emails" {...a11yProps(1)} sx={{ fontSize: 16 }} />
          <Tab label="Unverified Domains" {...a11yProps(2)} sx={{ fontSize: 16 }} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        {verified}
      </TabPanel>

      <TabPanel value={value} index={1} dir={theme.direction}>
        {unverifiedEmails}
      </TabPanel>

      <TabPanel value={value} index={2} dir={theme.direction}>
        {unverifiedDomains}
      </TabPanel>
    </Card>
  );
}
