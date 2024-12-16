import type { Step } from 'react-joyride';
import { ReturnType } from '../custom-popover/use-popover';

export interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}

export interface TourChecklist {
  isFinished: boolean;
  stepTitle: string;
  popover: ReturnType;
  stepIndex: number;
}
