import { Box, Button, Divider, IconButton, Typography } from '@mui/material';

import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useChecklistStore } from 'src/store/checklist-store';
import { useTourDialogStore } from 'src/store/tour-dialog';
import { TourChecklist } from './types';

export const TourDialog = () => {
  const popover = usePopover();
  const { status } = useChecklistStore((state) => state);

  const checklist = [
    {
      isFinished: status.step1Finished,
      stepTitle: 'Generate seed emails',
      stepIndex: 0,
    },
    {
      isFinished: status.step2Finished,
      stepTitle: 'Add sender emails',
      stepIndex: 1,
    },
    {
      isFinished: status.step3Finished,
      stepTitle: 'Create sender profile',
      stepIndex: 2,
    },
    {
      isFinished: status.step4Finished,
      stepTitle: 'Send to seed emails',
      stepIndex: 3,
    },
    {
      isFinished: status.step5Finished,
      stepTitle: 'View reports',
      stepIndex: 4,
    },
    {
      isFinished: status.step5Finished,
      stepTitle: 'Get Chat Support',
      stepIndex: 5,
    },
  ];

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
            {checklist.map((item) => {
              return (
                <Checklist
                  key={item.stepTitle}
                  isFinished={item.isFinished}
                  popover={popover}
                  stepTitle={item.stepTitle}
                  stepIndex={item.stepIndex}
                />
              );
            })}
          </Box>
        </Box>
      </CustomPopover>
    </>
  );
};

const Checklist = ({ isFinished, stepTitle, popover, stepIndex }: TourChecklist) => {
  const { setStep, setOpenModal } = useTourDialogStore((state) => state);

  const handleClick = () => {
    if (stepIndex === 3) {
      console.log('Open Modal');
      setStep(stepIndex);
      setOpenModal(true);

      // setTimeout(() => {
      //   setStep(stepIndex);
      // }, 500);
    } else {
      setStep(stepIndex);
    }

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
              {stepTitle}
            </Typography>
          </Box>
          <Iconify icon="tabler:chevron-right" />
        </Box>
      </Box>
    </Box>
  );
};
