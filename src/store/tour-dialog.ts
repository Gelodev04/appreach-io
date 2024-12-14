import { create } from 'zustand';

type TourDialogStore = {
  start: boolean;
  progress: number;
  setStartTour: (value: boolean) => void;
  setProgress: (value: number) => void;
};

export const useTourDialogStore = create<TourDialogStore>((set) => ({
  start: false,
  progress: 1,
  setStartTour: (value) => set({ start: value }),
  setProgress: (value) => set({ progress: value }),
}));
