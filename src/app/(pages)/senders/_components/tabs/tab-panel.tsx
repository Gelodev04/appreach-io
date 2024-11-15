'use client';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Suspense, useState } from 'react';
import { Card, Skeleton } from '@mui/material';
import { UnverifiedTable, VerifiedTable } from '../tables';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card sx={{ bgcolor: 'background.paper', minHeight: 700 }}>
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
        <Suspense fallback={<Skeleton height={600} />}>
          <VerifiedTable />
        </Suspense>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Suspense fallback={<Skeleton height={600} />}>
          <UnverifiedTable type="email" />
        </Suspense>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <Suspense fallback={<Skeleton height={600} />}>
          <UnverifiedTable type="domain" />
        </Suspense>
      </TabPanel>
    </Card>
  );
}
