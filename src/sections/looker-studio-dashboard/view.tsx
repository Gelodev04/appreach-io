'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';
// ----------------------------------------------------------------------

export default function LookerStudioDashboardView() {
  const lookerURL =
    'https://lookerstudio.google.com/embed/u/0/reporting/f5edec0e-e43b-444a-a04c-680c2bc37a2d/page/p_7qpzt55gad?params=%7B%22hc%22:%22test_0gc1j,outreachmagic_CLLUz,k2renewleads_1B59E,traduality_DVcT_,om_backend_Hbxg3,popcam_2kfNu,causia_ofVEo,visionarystudios_9WCLF,cw_canada_WmQ3E,testtest_As5BO%22%7D';

  useEffect(() => {
    const fetchLookerUrl = async () => {
      try {
        const response = await fetch('/api/looker-studio', {
          method: 'GET',
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLookerUrl();
  }, []);

  return (
    <Box
      sx={{
        height: '90vh',
      }}
    >
      <iframe
        src={lookerURL}
        width="100%"
        height="100%"
        title="Looker Studio Dashboard"
        style={{ borderRadius: '10px', border: 'none' }}
      />
    </Box>
  );
}
