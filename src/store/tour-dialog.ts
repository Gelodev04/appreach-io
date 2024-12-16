import { create } from 'zustand';

type TourDialogStore = {
  start: boolean;
  stepIndex: number;
  setStep: (stepIndex: number) => void;
  onClose: () => void;
};

export const useTourDialogStore = create<TourDialogStore>((set) => ({
  start: false,
  stepIndex: 1,
  setStep: (stepIndex) => set({ start: true, stepIndex }),
  onClose: () => set({ start: false }),
}));
