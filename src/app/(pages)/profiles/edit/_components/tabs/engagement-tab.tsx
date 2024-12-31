import { Icon } from '@iconify/react';
import { Box, Stack, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import { SliderItem } from './slider-item';

const sliderItems = [
  {
    sliderTitle: 'Scroll through message',
    icon: 'ri:scroll-to-bottom-fill',
    description: 'We will scroll through the message of {value} out of 1,000 emails',
    tooltipContent:
      'Mimic real users by scrolling through your emails in a web browser, signaling to email providers that your messages are engaging and improving deliverability.',
  },
  {
    sliderTitle: 'Mark as important',
    icon: 'material-symbols:bookmark-star-rounded',
    description: 'We will mark {value} out of 1,000 emails as important',
    tooltipContent:
      "Marking emails as important increases their priority in recipients' inboxes and improves future deliverability.",
  },
  {
    sliderTitle: 'Remove from spam',
    icon: 'mdi:email-remove',
    description: 'We will remove {value} out of 1,000 emails from spam',
    tooltipContent:
      'Moving emails from spam to the inbox trains email providers to trust your messages.',
  },
  {
    sliderTitle: 'Move to primary',
    icon: 'material-symbols:forward-to-inbox-rounded',
    description: 'We will move {value} out of 1,000 emails to the primary inbox',
    tooltipContent:
      'Using real browsing actions, we move emails to the primary inbox, improving visibility and engagement.',
  },
  {
    sliderTitle: 'Click links',
    icon: 'mdi:cursor-default-click',
    description: 'We will click on links in {value} out of 1,000 emails',
    tooltipContent:
      'We replicate real user behavior by clicking on links within your email, boosting engagement metrics and campaign performance.',
  },
];

export const EngagementTab = () => {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        How would you like us to engage with the emails?
      </Typography>
      <Stack spacing={5}>
        {sliderItems.map((item) => {
          return (
            <SliderItem
              key={item.sliderTitle}
              sliderTitle={item.sliderTitle}
              icon={item.icon}
              description={item.description}
              tooltipContent={item?.tooltipContent}
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
        <Box sx={{ position: 'relative', padding: 1.5 }}>
          <RHFTextField
            name="links_to_click"
            label="Links to click"
            placeholder="download, apply"
            multiline
            minRows={1}
            maxRows={3}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '100%',
              position: 'absolute',
              right: -10,
              top: -10,
              padding: '3px',
              color: '#9F9F9F',
            }}
          >
            <Icon width={20} icon="material-symbols:info-outline" />
          </Box>
        </Box>
        <Box sx={{ position: 'relative', padding: 1.5 }}>
          <RHFTextField
            name="links_not_to_click"
            label="Links not to click"
            placeholder="unsubscribe, do not contact"
            multiline
            minRows={1}
            maxRows={3}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '100%',
              position: 'absolute',
              right: -10,
              top: -10,
              padding: '3px',
              color: '#9F9F9F',
            }}
          >
            <Icon width={20} icon="material-symbols:info-outline" />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};
