import type { Step } from 'react-joyride';

export interface TourGuideProps {}

export interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}
