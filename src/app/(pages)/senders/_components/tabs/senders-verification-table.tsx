'use client';

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ReactNode, Suspense, useState } from 'react';
import { Card, Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';

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
        <Box>
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

const UnverifiedTable = dynamic(() => import('../tables/unverified-table'), {
  loading: () => <Skeleton height={600} />,
});

const VerifiedTable = dynamic(() => import('../tables/verified-table'), {
  loading: () => <Skeleton height={600} />,
  ssr: false,
});

export default function SendersVerificationTable({
  options,
}: {
  options: {
    profile: string;
    id: string;
  }[];
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
          <Tab label="Verified Domains" {...a11yProps(2)} sx={{ fontSize: 16 }} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <VerifiedTable options={options} />
      </TabPanel>

      <TabPanel value={value} index={1} dir={theme.direction}>
        <UnverifiedTable type="email" options={options} />
      </TabPanel>

      <TabPanel value={value} index={2} dir={theme.direction}>
        <UnverifiedTable type="domain" options={options} />
      </TabPanel>
    </Card>
  );
}
