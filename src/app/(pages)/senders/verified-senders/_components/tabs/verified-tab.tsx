'use client';

import { AppBar, Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactNode, SyntheticEvent, useState } from 'react';
import { Icon, IconifyIcon } from '@iconify/react';
import TabPanel from './tab-panel';

const VerifiedTabHeader = ({ icon, title }: { icon: string | IconifyIcon; title: string }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Icon icon={icon} width={22} />
      <Typography>{title}</Typography>
    </Box>
  );
};

export default function VerifiedTab({
  verifiedDomain,
  verifiedEmail,
}: {
  verifiedDomain: ReactNode;
  verifiedEmail: ReactNode;
}) {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (e: SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ paddingY: 2 }}>
      <Divider />
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
              <VerifiedTabHeader
                icon="material-symbols:mark-email-read-rounded"
                title="Verified Email"
              />
            }
            {...a11yProps(0)}
          />
          <Tab
            label={<VerifiedTabHeader icon="mdi:internet" title="Verified Domain" />}
            {...a11yProps(1)}
            sx={{ fontSize: 16 }}
          />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        {verifiedEmail}
      </TabPanel>

      <TabPanel value={value} index={1} dir={theme.direction}>
        {verifiedDomain}
      </TabPanel>
    </Box>
  );
}
