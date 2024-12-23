'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useTourDialogStore } from 'src/store/tour-dialog';

export default function TourModal() {
  const { stepIndex, setStep, setOpenModal, openModal, setStart } = useTourDialogStore(
    (state) => state
  );

  useEffect(() => {
    if (openModal) {
      setStep(3);
    }
  }, [openModal, setStep, stepIndex]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setStart(false);
  };

  return (
    <Dialog sx={{ zIndex: 10000 }} fullWidth maxWidth="lg" open={openModal}>
      <DialogTitle>Send to seed emails</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
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
              playing
              muted
              controls
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleCloseModal}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
