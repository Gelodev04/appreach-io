import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CallBackProps, Step } from 'react-joyride';
import Joyride, { EVENTS, STATUS } from 'react-joyride';
import { useTourDialogStore } from 'src/store/tour-dialog';
import { State } from './types';

export const TourGuide = () => {
  const totalSteps = 4;
  const router = useRouter();
  const { start, progress, setStartTour, setProgress } = useTourDialogStore((state) => state);

  const generateSteps = (val: number): Step[] => [
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
    // {
    //   content: (
    //     <div>
    //       <p>Step 2: Add the emails you will be sending from</p>
    //     </div>
    //   ),
    //   styles: {
    //     options: {
    //       width: 380,
    //     },
    //   },
    //   placement: 'right',
    //   target: '#sender_addresses',
    //   title: 'Add sender emails',
    //   disableBeacon: true,
    // },
    // {
    //   content: (
    //     <div>
    //       <p>Step 3: Let us know how you want we should engage with your profiles</p>
    //     </div>
    //   ),
    //   styles: {
    //     options: {
    //       width: 380,
    //     },
    //   },
    //   placement: 'right',
    //   target: '#sender_profiles',
    //   title: 'Create sender profile',
    //   disableBeacon: true,
    // },
    // {
    //   content: (
    //     <div>
    //       <p>Step 4: Review our tutorial on how to send to our seed accounts</p>
    //     </div>
    //   ),
    //   styles: {
    //     options: {
    //       width: 380,
    //     },
    //   },
    //   placement: 'right',
    //   target: '#subscription',
    //   title: 'Send to seed emails',
    //   disableBeacon: true,
    // },
    // {
    //   content: (
    //     <div>
    //       <p>Step 5: Review our tutorial on how to review reports</p>
    //     </div>
    //   ),
    //   styles: {
    //     options: {
    //       width: 380,
    //     },
    //   },
    //   placement: 'right',
    //   target: '#logout',
    //   title: 'View reports',
    //   disableBeacon: true,
    // },
  ];

  const [{ run, steps }, setState] = useState<State>({
    run: start,
    stepIndex: 0,
    steps: generateSteps(progress),
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      steps: generateSteps(progress),
    }));
  }, [progress]);

  useEffect(() => {
    if (start) {
      setState((prevState) => ({
        ...prevState,
        run: true,
        stepIndex: 0,
      }));
    }
  }, [start]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;

    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    const events: string[] = [EVENTS.STEP_BEFORE];

    console.log({ status, type, index, action });
    if (finishedStatuses.includes(status)) {
      setState({ steps, run: false, stepIndex: 0 });
      setStartTour(false);
    } else if (events.includes(type)) {
      setProgress(index + 1);
    }

    //  else if (index === 2) {
    //   router.push('/senders/');
    // }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      run={run}
      steps={steps}
      spotlightClicks
      showProgress
      hideBackButton
      disableCloseOnEsc
      disableOverlayClose
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
      locale={{ skip: 'Stop guide', last: 'Finish', open: 'Show guide' }}
    />
  );
};
