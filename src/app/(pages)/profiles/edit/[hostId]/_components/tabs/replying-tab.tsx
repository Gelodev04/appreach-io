import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { RHFTextField } from 'src/components/hook-form';
import { HostProps } from 'src/types/host';
import { SliderItem } from './slider-item';

export const ReplyingTab = ({ planPermissions }: HostProps) => {
  const enabled = planPermissions.planPermissionFeatures.replyMessage;
  return (
    <Stack spacing={7}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Maximize engagement by replying to emails using AI.
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
        <Box
          sx={{
            alignSelf: 'center',
            minWidth: '300px',
          }}
        >
          <RHFTextField
            disabled={!enabled}
            name="filterId"
            label="Filter ID Key"
            tooltipContent="Assign a unique identifier to filter out AI-generated replies."
            tooltipID="filter-id-popover"
          />
        </Box>

        <SliderItem
          maxVal={planPermissions.seeds}
          disabled={!enabled}
          sliderTitle="Reply using AI"
          sliderName="replyMessage"
          engagementMax={planPermissions.planPermissionFeatures.engagementMax}
          icon="mdi:robot"
          description="We will reply to {value} out of {max_value} to emails"
          tooltipContent="Generate automated, human-like replies to emails to improve engagement and simulate realistic interactions."
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: 'column',
          alignSelf: 'center',
          minWidth: '500px',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ textAlign: 'center', color: !enabled ? '#94A0AE' : 'black' }}
        >
          Customize your AI Prompt
        </Typography>
        <RHFTextField
          name="replyPrompt"
          disabled={!enabled}
          multiline
          minRows={1}
          label="AI Prompt"
          tooltipContent="Tailor the AI’s behavior and tone by customizing the prompt to ensure replies align with your brand."
          tooltipID="ai-prompt-popover"
        />
      </Box>
    </Stack>
  );
};
