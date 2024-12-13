import { Icon } from '@iconify/react';
import { Box, Tooltip, useTheme } from '@mui/material';

export default function VerifyUnverifyIcon({
  isVerified,
  tooltipText,
}: {
  isVerified: boolean;
  tooltipText: string;
}) {
  const theme = useTheme();

  return (
    <Box display="flex">
      <Tooltip
        title={
          isVerified
            ? `This sender ${tooltipText} is verified.`
            : `This sender  ${tooltipText} is unverified.`
        }
        placement="top-start"
      >
        <Icon
          icon={
            isVerified
              ? 'material-symbols:verified-rounded'
              : 'material-symbols-light:error-outline-rounded'
          }
          color={theme.palette.primary.lighter}
          width={24}
        />
      </Tooltip>
    </Box>
  );
}
