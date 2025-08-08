import type { CallBackProps, Step } from 'react-joyride';
import Joyride, { ACTIONS } from 'react-joyride';
import { useTourDialogStore } from 'src/store/tour-dialog';

export const TourGuide = () => {
  const steps: Step[] = [
    {
      content: (
        <div>
          <p>
            Click &quot;Generate Seed List&quot; and select the number of seed accounts for each
            ESP.
          </p>
        </div>
      ),

      placement: 'right',
      target: '#dashboard',
      title: 'Start with Dashboard',
      disableBeacon: true,
    },

    {
      content: (
        <div>
          <p>
            Add the email accounts you use to send emails (e.g., from SmartLead, Mailchimp,
            HubSpot). Verify emails one at at time or an entire domain.
          </p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#verified_senders',
      title: 'Add sender emails',
      disableBeacon: true,
    },
    {
      content: (
        <div>
          <p>Set up sender profiles to define how we should engage with your emails.</p>
        </div>
      ),
      styles: {
        options: {
          width: 380,
        },
      },
      placement: 'right',
      target: '#account_profiles',
      title: 'Create sender profile',
      disableBeacon: true,
    },
    {
      content: (
        <div>
          <p>Review our tutorial on how to send to our seed accounts.</p>
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
          <p>Review our tutorial on how to send to our understand the reports.</p>
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
  ];

  const { start, stepIndex, onClose } = useTourDialogStore((state) => state);

  const joyrideCallback = (callback: CallBackProps) => {
    const { action } = callback;

    if (ACTIONS.CLOSE === action) onClose();

    // if (index === 3) {
    //   setStart(false);

    //   setTimeout(() => {
    //     setStart(true);
    //   }, 500);
    // }
  };

  return (
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
  );
};
