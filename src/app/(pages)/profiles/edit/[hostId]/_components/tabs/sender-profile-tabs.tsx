import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useState } from 'react';
import { HostProps } from 'src/types/host';
import { EngagementTab } from './engagement-tab';
import { ReplyingTab } from './replying-tab';

export const SenderProfileTabs = ({ currentItem, userSettings }: HostProps) => {
  const [value, setValue] = useState('sender_engagement');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            textColor="primary"
            TabIndicatorProps={{ sx: { backgroundColor: '#003087' } }}
            variant="fullWidth"
            onChange={handleChange}
            aria-label="Edit sender profile tabs"
          >
            <Tab sx={{ fontSize: 16 }} label="Engagement" value="sender_engagement" />
            <Tab sx={{ fontSize: 16 }} label="Replying" value="sender_replying" />
          </TabList>
        </Box>
        <TabPanel value="sender_engagement">
          <EngagementTab maxVal={userSettings.planPermissions.seeds} />
        </TabPanel>
        <TabPanel value="sender_replying">
          <ReplyingTab currentItem={currentItem} maxVal={userSettings.planPermissions.seeds} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
