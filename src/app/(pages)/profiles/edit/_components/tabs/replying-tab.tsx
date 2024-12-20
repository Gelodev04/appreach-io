'use client';

import { Icon } from '@iconify/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { RHFTextField } from 'src/components/hook-form';
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
          Advanced Feature: Reply using AI
        </Typography>
        {enabled ? (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            This feature is available on your current plan.
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            <span>
              <Link href="/subscription">Upgrade </Link>
            </span>
            to enable this feature.
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ alignSelf: 'center', position: 'relative', minWidth: '300px', padding: 1.5 }}>
          <RHFTextField
            disabled={!enabled}
            name="filter_id_key"
            label="Filter ID Key"
            defaultValue="Kajda3"
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

        <SliderItem
          disabled={!enabled}
          sliderTitle="Reply using AI"
          icon="mdi:robot"
          description="We will reply to 250 out of 1,000 to primary"
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          gap: 2,
          flexDirection: 'column',
          alignSelf: 'center',
          minWidth: '500px',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ textAlign: 'center', color: enabled ? 'black' : '#94A0AE' }}
        >
          Customize your AI Prompt
        </Typography>
        <RHFTextField
          name="ai_prompt"
          disabled={!enabled}
          multiline
          minRows={1}
          label="AI Prompt"
          defaultValue="Write a professional, friendly, and engaging reply to a cold email. The response should express interest in the sender's proposal or service, show appreciation for their outreach, and ask a thoughtful follow-up question to keep the conversation going. Use a tone that is warm and approachable but professional. Ensure the reply sounds personalized and tailored to the email content, referencing specific details provided by the sender. Here’s the original cold email: [email content goes here]"
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            position: 'absolute',
            right: 0,
            top: 0,
            padding: '3px',
            color: '#9F9F9F',
          }}
        >
          <Icon width={20} icon="material-symbols:info-outline" />
        </Box>
      </Box>

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
