import { Icon } from '@iconify/react';
import { Box, Stack, Typography } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import { SliderItem } from './slider-item';

const sliderItems = [
  {
    sliderTitle: 'Scroll through message',
    icon: 'ri:scroll-to-bottom-fill',
    description: 'We will scroll through the message of 250 out of 1,000 emails',
  },
  {
    sliderTitle: 'Mark as important',
    icon: 'material-symbols:bookmark-star-rounded',
    description: 'We will mark 250 out of 1,000 emails as important',
  },
  {
    sliderTitle: 'Remove from spam',
    icon: 'mdi:email-remove',
    description: 'We will remove 250 out of 1,000 emails from spam',
  },
  {
    sliderTitle: 'Move to primary',
    icon: 'material-symbols:forward-to-inbox-rounded',
    description: 'We will move 250 out of 1,000 emails to the primary inbox',
  },
  {
    sliderTitle: 'Click links',
    icon: 'mdi:cursor-default-click',
    description: 'We will click on links in 250 out of 1,000 emails',
    tooltipContent:
      ' Let us know what text to click / not click or leave blank for random. You can have multiple links by seperating with a coma',
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
