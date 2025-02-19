import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useSenderAddressTabStore } from 'src/store/sender-address-tab';
import { HostProps } from 'src/types/host';
import { EngagementTab } from './engagement-tab';
import { ReplyingTab } from './replying-tab';

export const SenderProfileTabs = ({ currentItem, planPermissions }: HostProps) => {
  const { tab, setTab } = useSenderAddressTabStore((state) => state);
  const handleTabChange = (event: React.SyntheticEvent, value: string) => {
    setTab(value);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            textColor="primary"
            TabIndicatorProps={{ sx: { backgroundColor: '#003087' } }}
            variant="fullWidth"
            onChange={handleTabChange}
            aria-label="Edit sender profile tabs"
          >
            <Tab sx={{ fontSize: 16 }} label="Engagement" value="sender_engagement" />
            <Tab sx={{ fontSize: 16 }} label="Replying" value="sender_replying" />
          </TabList>
        </Box>
        <TabPanel value="sender_engagement">
          <EngagementTab planPermissions={planPermissions} />
        </TabPanel>
        <TabPanel value="sender_replying">
          <ReplyingTab currentItem={currentItem} planPermissions={planPermissions} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
