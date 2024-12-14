import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ReturnType } from 'src/components/custom-popover/use-popover';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useChecklistStore } from 'src/store/checklist-store';
import { useTourDialogStore } from 'src/store/tour-dialog';

export const TourDialog = () => {
  const popover = usePopover();
  const { status } = useChecklistStore((state) => state);

  return (
    <>
      <Button onClick={popover.onOpen} sx={{ width: '100%' }} variant="contained" color="primary">
        Get Started
      </Button>
      <CustomPopover arrow="bottom-center" open={popover.open} sx={{ width: 300, p: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, pb: 1.5, gap: '5px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Checklist
            </Typography>
            <IconButton onClick={popover.onClose} aria-label="close">
              <Iconify icon="material-symbols:close" />
            </IconButton>
          </Box>
          <Divider />
          <Typography variant="body2">
            Let us walk you through the setup steps to ensure you maximize the benefits of your
            inboxdaddy account!
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <Checklist
              isFinished={status.step1Finished}
              popover={popover}
              step="Generate seed emails"
              stepIndex={0}
              route={paths.seed.root}
            />
            <Checklist
              isFinished={status.step2Finished}
              popover={popover}
              step="Add sender emails"
              stepIndex={1}
              route={paths.senders.root}
            />
            <Checklist
              isFinished={status.step3Finished}
              popover={popover}
              step="Create sender profile"
              stepIndex={2}
              route={paths.settings.root}
            />
            <Checklist
              isFinished={status.step4Finished}
              popover={popover}
              step="Send to seed emails"
              stepIndex={3}
              route={paths.dashboard.root}
            />
            <Checklist
              isFinished={status.step5Finished}
              popover={popover}
              step="View reports"
              stepIndex={4}
              route={paths.dashboard.root}
            />
          </Box>
        </Box>
      </CustomPopover>
    </>
  );
};

const Checklist = ({
  isFinished,
  step,
  popover,
  stepIndex,
  route,
}: {
  isFinished: boolean;
  step: string;
  popover: ReturnType;
  stepIndex: number;
  route: string;
}) => {
  const { setStep } = useTourDialogStore((state) => state);
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
    setStep(stepIndex);
    popover.onClose();
  };

  return (
    <Box onClick={handleClick}>
      <Box
        p={1}
        sx={{
          borderRadius: '5px',
          ':hover': {
            cursor: 'pointer',
            background: 'rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}
          >
            {isFinished ? (
              <Iconify sx={{ color: 'green' }} icon="tabler:circle-check-filled" />
            ) : (
              <Iconify icon="tabler:circle" />
            )}
            <Typography
              sx={{
                textDecoration: isFinished ? 'line-through' : 'none',
              }}
            >
              {step}
            </Typography>
          </Box>
          <Iconify icon="tabler:chevron-right" />
        </Box>
      </Box>
    </Box>
  );
};
