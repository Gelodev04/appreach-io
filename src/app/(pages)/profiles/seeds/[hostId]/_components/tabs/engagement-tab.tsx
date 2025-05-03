import { Box, Stack, Typography } from '@mui/material';
import { RHFSwitch, RHFTextField } from 'src/components/hook-form';
import { HostProps } from 'src/types/host';
import { SliderItem } from './slider-item';

const sliderItems = [
  {
    sliderTitle: 'Scroll through message',
    sliderName: 'scrollMessage',
    icon: 'ri:scroll-to-bottom-fill',
    description: 'We will scroll through the message of {value} out of {max_value} emails',
    tooltipContent:
      'Mimic real users by scrolling through your emails in a web browser, signaling to email providers that your messages are engaging and improving deliverability.',
  },
  {
    sliderTitle: 'Mark as important',
    sliderName: 'markImportant',
    icon: 'material-symbols:bookmark-star-rounded',
    description: 'We will mark {value} out of {max_value} emails as important',
    tooltipContent:
      "Marking emails as important increases their priority in recipients' inboxes and improves future deliverability.",
  },
  {
    sliderTitle: 'Remove from spam',
    sliderName: 'removeSpam',
    icon: 'mdi:email-remove',
    description: 'We will remove {value} out of {max_value} emails from spam',
    tooltipContent:
      'Moving emails from spam to the inbox trains email providers to trust your messages.',
  },
  {
    sliderTitle: 'Move to primary',
    sliderName: 'movePrimary',
    icon: 'material-symbols:forward-to-inbox-rounded',
    description: 'We will move {value} out of {max_value} emails to the primary inbox',
    tooltipContent:
      'Using real browsing actions, we move emails to the primary inbox, improving visibility and engagement.',
  },
  {
    sliderTitle: 'Click links',
    sliderName: 'clickLink',
    icon: 'mdi:cursor-default-click',
    description: 'We will click on links in {value} out of {max_value} emails',
    tooltipContent:
      'We replicate real user behavior by clicking on links within your email, boosting engagement metrics and campaign performance.',
  },
];

export const EngagementTab = ({ planPermissions }: HostProps) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        How would you like us to engage with the emails?
      </Typography>
      <Stack spacing={5}>
        {sliderItems.map((item) => {
          const featureValue =
            planPermissions.planPermissionFeatures[
              item.sliderName as keyof typeof planPermissions.planPermissionFeatures
            ];

          const isDisabled = typeof featureValue === 'boolean' ? featureValue : undefined;
          return (
            <SliderItem
              key={item.sliderTitle}
              maxVal={planPermissions.seeds}
              disabled={!isDisabled}
              engagementMax={planPermissions.planPermissionFeatures.engagementMax}
              {...item}
            />
          );
        })}
      </Stack>
      <Box
        columnGap={2}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <RHFTextField
          InputLabelProps={{ shrink: true }}
          name="linksToClick"
          label="Links to click"
          tooltipContent="Prioritize clicks on important links, driving attention to your key content and increasing click-through rates."
          tooltipID="links-to-click-popover"
          placeholder="download, apply"
          multiline
          minRows={1}
          maxRows={3}
        />

        <RHFTextField
          InputLabelProps={{ shrink: true }}
          name="linksNotToClick"
          label="Links not to click"
          tooltipContent="Avoid interacting with certain links, such as unsubscribe links, to maintain natural engagement behavior."
          tooltipID="links-not-to-click-popover"
          placeholder="unsubscribe, do not contact"
          multiline
          minRows={1}
          maxRows={3}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <RHFSwitch name="useEventSenders" label="Use event senders for this profile?" />
      </Box>
    </Stack>
  );
};
