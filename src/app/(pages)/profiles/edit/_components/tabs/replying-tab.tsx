'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { AIPromptField } from './ai-prompt-field';
import { FilterIDField } from './filter-id-field';
import { SliderItem } from './slider-item';

export const ReplyingTab = () => {
  const [enabled, setEnabled] = useState(true);

  const handleClick = () => {
    setEnabled(!enabled);
  };

  return (
    <Stack spacing={7}>
      <Box>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          New feature! Maximize your cold email campaigns by replying to actually campaign emails.
        </Typography>
        {enabled ? (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            This feature is available on your current plan.
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            <span>
              <Link href="/subscription">Upgrade</Link>
            </span>{' '}
            to enable this feature.
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FilterIDField enabled={enabled} />

        <SliderItem
          disabled={!enabled}
          sliderTitle="Reply using AI"
          icon="mdi:robot"
          description="We will reply to {value} out of 1,000 to primary"
          tooltipContent="Generate automated, human-like replies to emails to improve engagement and simulate realistic interactions."
        />
      </Box>

      <AIPromptField enabled={enabled} />

      <Box
        sx={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'column', display: 'flex' }}
      >
        <Button variant="contained" onClick={handleClick}>
          Toggle Feature
        </Button>
        <Typography variant="body2">For testing purposes*</Typography>
      </Box>
    </Stack>
  );
};
