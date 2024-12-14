import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CallBackProps, Step } from 'react-joyride';
import Joyride, { EVENTS, STATUS, ACTIONS } from 'react-joyride';
import { useTourDialogStore } from 'src/store/tour-dialog';
import { State } from './types';

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
    },
    // {
    //   content: (
    //     <div>
    //       <p>Step 2: Generate seed emails</p>
    //     </div>
    //   ),

    //   target: '#generate_seed_btn',
    //   title: 'Generate seed emails here',
    //   disableBeacon: true,
    // },
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
      target: '#subscription',
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
      target: '#logout',
      title: 'View reports',
      disableBeacon: true,
    },
  ];

  const { start, stepIndex, onClose } = useTourDialogStore((state) => state);

  const joyrideCallback = (callback: CallBackProps) => {
    const { action } = callback;
    if (ACTIONS.CLOSE === action) onClose();
  };

  return (
    <Joyride
      callback={joyrideCallback}
      run={start}
      steps={steps}
      spotlightClicks
      showProgress
      disableCloseOnEsc
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
  );
};
