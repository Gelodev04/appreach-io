import { Icon } from '@iconify/react';
import { Box, Popover, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { RHFTextField } from 'src/components/hook-form';

export const AIPromptField = ({ enabled }: { enabled: boolean }) => {
  const popoverAnchor = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    setOpenedPopover(false);
  };

  return (
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
        ref={popoverAnchor}
        aria-owns={openedPopover ? 'ai-prompt-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={popoverEnter}
        onMouseLeave={popoverLeave}
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

      <Popover
        id="ai-prompt-popover"
        open={openedPopover}
        anchorEl={popoverAnchor.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onMouseEnter={popoverEnter}
        onMouseLeave={popoverLeave}
        slotProps={{ paper: { sx: { pointerEvents: 'auto' } } }}
        sx={{ pointerEvents: 'none' }}
      >
        <Box sx={{ maxWidth: '300px', padding: 1 }}>
          <Typography variant="body2">{`Tailor the AI’s behavior and tone by customizing the prompt to ensure replies align with your brand voice and objectives. Use {email_content} to insert the email content.`}</Typography>
        </Box>
      </Popover>
    </Box>
  );
};
