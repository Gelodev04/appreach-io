import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { CallBackProps, Step } from 'react-joyride';
import Joyride, { ACTIONS } from 'react-joyride';
import ReactPlayer from 'react-player';
import { useTourDialogStore } from 'src/store/tour-dialog';

export const TourGuide = () => {
  const steps: Step[] = [
    {
      content: (
        <div>
          <p>Step 1: Generate seed emails</p>
        </div>
      ),

      placement: 'right',
      target: '#seeds',
      title: 'Generate seed emails',
      disableBeacon: true,
      data: {
        close: '/seeds',
      },
    },

    {
      content: (
        <div>
          <p>Step 2: Add the emails you will be sending from</p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#sender_addresses',
      title: 'Add sender emails',
      disableBeacon: true,
    },
    {
      content: (
        <div>
          <p>Step 3: Let us know how you want we should engage with your profiles</p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#sender_profiles',
      title: 'Create sender profile',
      disableBeacon: true,
    },
    {
      content: (
        <div>
          <p>Step 4: Review our tutorial on how to send to our seed accounts</p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#tutorial_modal',
      title: 'Send to seed emails',
      disableBeacon: true,
    },
    {
      content: (
        <div>
          <p>Step 5: Review our tutorial on how to review reports</p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#dashboard',
      title: 'View reports',
      disableBeacon: true,
    },
    {
      content: (
        <div>
          <p>Send us a message with any questions you might have</p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#sm-widget-launcher-btn',
      title: 'View reports',
      disableBeacon: true,
      spotlightClicks: false,
    },
  ];

  const { start, stepIndex, onClose, openModal, setOpenModal } = useTourDialogStore(
    (state) => state
  );

  const joyrideCallback = (callback: CallBackProps) => {
    const { action, status, index } = callback;

    console.log({ action, status, index });
    if (ACTIONS.CLOSE === action) onClose();

    // if (index === 3) {
    //   setStart(false);

    //   setTimeout(() => {
    //     setStart(true);
    //   }, 500);
    // }
  };

  return (
    <>
      <Joyride
        callback={joyrideCallback}
        run={start}
        steps={steps}
        showProgress
        disableScrolling
        spotlightClicks
        disableCloseOnEsc
        disableOverlayClose
        stepIndex={stepIndex}
        hideBackButton
        // debug
        styles={{
          options: {
            zIndex: 9999,
            arrowColor: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
            overlayColor: 'rgba(0, 0, 0, 0.9)',
            primaryColor: '#003087',
          },
          buttonClose: {
            marginTop: '5px',
            marginRight: '5px',
            width: '12px',
          },
          buttonNext: {
            padding: '0.5rem 2rem',
            marginLeft: '1rem',
            borderRadius: '7px',
          },
        }}
        locale={{ skip: 'Stop guide', last: 'Finish', open: 'Show guide', close: 'Close' }}
      />
      <Dialog sx={{ zIndex: 10000 }} fullWidth={true} maxWidth="lg" open={openModal}>
        <DialogTitle>Send to seed emails</DialogTitle>

        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}
        >
          <Typography variant="body1" sx={{}}>
            Review our tutorial on how to send to our seed accounts
          </Typography>
          <Box sx={{ width: '100%', height: 'auto' }} id="tutorial_modal">
            <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
              <ReactPlayer
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                width="100%"
                height="100%"
                url="https://www.youtube.com/watch?v=10_y4x38jbU"
                playing={true}
                muted={true}
                controls={true}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
